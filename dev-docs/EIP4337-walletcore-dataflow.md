EIP-4337合约钱包核心流程[wallet core 模块]

1. 初始化

   生成私钥 -> 生成合约钱包地址
   如果在entrypoint地址确定的情况下,合约钱包地址仅仅与合约钱包的源码有关系,一般情况下合约源码为同质格式化代码,仅仅会在权限验证处写入不同的公钥,从这个角度来说,合约钱包地址仅仅依赖用户的控制公钥.
   获取钱包地址流程为先获取用户公钥,拼接合约源码,然后通过solc生成合约opcode[也可以不使用solc,直接通过替换opcode中存储的16进制公钥来实现,这样更简单],再通过opcode(initCode)使用以下兼容的本地函数计算出钱包地址

   ```solidity
   
   address walletAddress = keccak256(abi.encodePacked(
                   bytes1(0xff),
                   address(entry point 合约地址),
                   salt,//可以为固定值 例如 0x0
                   keccak256(initCode)
               )
   );
   
   ```



   数据流:

   ```
   ┌───────────────────────────────────┐
   │                                   │
   │         ┌──────────────┐          │
   │         │  public key  │          │
   │         └───────┬──────┘          │
   │                 │                 │
   │                 ▼                 │
   │   ┌──────────────────────────┐    │
   │   │ contract wallet initCode │    │
   │   └─────────────┬────────────┘    │
   │                 │ solc            │
   │                 ▼                 │
   │           ┌──────────┐            │
   │           │  opcode  │            │
   │           └─────┬────┘            │
   │                 │                 │
   │                 │ create2         │
   │                 ▼                 │
   │    ┌─────────────────────────┐    │
   │    │ contract wallet address │    │
   │    └─────────────────────────┘    │
   │                                   │
   └───────────────────────────────────┘
   ```



2. 收款代币
   - 收款 erc20 , 无需实际部署钱包即可收款
   
   - 收款 erc721 等,无实际部署完成钱包就可以收款
   ```
   对于实现了ERC165的token(例如erc721),使用safeTransferFrom()函数时往往需要确定收款合约中包含 supportsInterface(bytes4 interfaceID) 且返回正确的值时往往才能发送NFT,但是未部署的合约钱包对于NFT合约来说是一个外部账户(EOA),在部署之前没有任何限制的
   ```
   
     
   
3. 单独部署合约钱包

   构造UserOperation
   
   ```solidity
   struct UserOperation {
    {
        address sender; = create2(合约代码)
        uint256 nonce; = 0 //依赖合约代码中的nonce,防止重放攻击
        bytes initCode; // 合约代码
        bytes callData;  //具体执行内容 钱包通过用户的请求转成的opcode
        uint256 callGas; //本机模拟计算出,执行callData的gas
        uint256 verificationGas;// validateUserOp/validatePaymasterUserOp使用的gas
        uint256 preVerificationGas;//额外准备的小部分gas 应对一些常规例如循环等逻辑gas的消耗
        uint256 maxFeePerGas;//gas价格
        uint256 maxPriorityFeePerGas;//EIP1559中分配给矿工的费用
        address paymaster; // paymaster的合约地址
        bytes paymasterData;  // 发送给paymaster的数据,现在paymaster的实现还不明确,如果使用我们自己的paymaster则不需要此值,固定为 0x0就行
        bytes signature;//签名
    }
   ```

   ```
   - verificationGas:entrypoint每次执行时都需要调用用户合约钱包中的validateUserOp函数来确定是否有相应的权限,verificationGas就是调用contract wallet -> validateUserOp 中预期的最大gas消耗,本地可模拟计算出
   
   - preVerificationGas: 额外准备的小部分gas 应对一些常规例如循环等逻辑gas的消耗,具体取值需要测试合约后定一个保守的值即可
   
   - signature: 签名,此签名的内容要求符合用户钱包中的权限验证,最简单最直接的签名就是使用EIP-712 , 可以从签名内容中导出签名者(contract wallet owner),常规的方式是直接使用私钥签名 requestid(后面说明requestid)+entrypoint address + chainID ,简单实用且可以防止重放攻击
   ```
   
   ```
   每次提交数据给paymaster/entrypoint时除了UserOperation本身 还需要提交一个requestid用来防止重放攻击,requestid可以理解为UserOperation里面除了signature的全部内容的哈希值
   计算requestid方法为:keccak256(abi.encode(userOp.hash(), address(this/*entrypoint*/), block.chainid));
   其中userop.hash()兼容实现为:
   keccak256(abi.encode(
                userOp.getSender(), // contract钱包地址
                userOp.nonce, // 防止重放攻击的递增整数,用户钱包内会验证此值
                keccak256(userOp.initCode),
                keccak256(userOp.callData),
                userOp.callGas,
                userOp.verificationGas,
                userOp.preVerificationGas,
                userOp.maxFeePerGas,
                userOp.maxPriorityFeePerGas,
                userOp.paymaster
            ));
   ```
   
   流程图:
   ```
   ┌─────────────────────────┐   ┌────────────────────────────────┐
   │ contract wallet address │   │ get nonce from contract wallet │
   └────────────────────┬────┘   └───┬────────────────────────────┘
                     │            │
                     │            │
                     ▼            ▼
              ┌────────────────────────┐
              │                        │     ┌──────────────────┐
              │    PreUserOperation    │     │ user private key │
              │                        │     └────────┬─────────┘
              └────────────┬───────────┘              │
                           │  Calculate gas fee       │  signature
                           │                          │
                           └─────────┐        ┌───────┘
                                     │        │
                                     ▼        ▼
                               ┌───────────────────┐
                               │                   │
                               │   UserOperation   │
                               │                   │
                               └──────────┬────────┘
                                          │
                                          ▼
                                         ...
                         ┌────────┐   ┌────────┐   ┌───────────────┐
                         │   p2p  │   │  http  │   │ any broadcast │  eg. discord,telegram,forum ...
                         └────────┘   └────────┘   └───────────────┘
                                         ...
                                          │
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │                      │
                               │    paymaster api     │
                               │                      │
                               └──────────────────────┘
   ```
   
   ```
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │                       │   │                       │   │                       │
   │     UserOperation     │   │     UserOperation     │   │     UserOperation     │     ...
   │                       │   │                       │   │                       │
   └───────────┬───────────┘   └───────────┬───────────┘   └────────────┬──────────┘
               │                           │                            │
               │                           │                            │
               ▼                           │                            │
   ┌──────────────────────┐                │                            │
   │                      │                │                            │
   │    paymaster api     │                │                            │
   │                      │                │                            │
   └──────────┬───────────┘                │                            │
              │                            │                            │
              │  if pay gas for current contract wallet                 │
              ▼                            │                            │
    ┌───────────────────┐                  │                            │
    │                   │                  │                            │
    │     EntryPoint    │                  │                            │
    │                   │                  │                            │
    └──────────┬────────┘                  │                            │
               │                           │                            │
               │ call                      │                            │
               │                           │                            │
               ▼                           │                            │
   ┌───────────────────────────┐           │                            │
   │                           │           │                            │
   │     simulateValidation    │           │                            │
   │                           │           │                            │
   └──────────┬────────────────┘           │                            │
              │                            │                            │
              │                            │                            │
              │                            │                            │
              └──────────────┐      ┌──────┘   ┌────────────────────────┘
                             ▼      ▼          ▼
                     ┌─────────────────────────────┐
                     │                             │
                     │    UserOperation Arrary     │  bundle
                     │                             │
                     └──────────────┬──────────────┘
                                    │
                                    │ 
                                    ▼
                     ┌──────────────────────────────┐
                     │                              │
                     │    EntryPoint::handleOps()   │
                     │                              │
                     └──────────────────────────────┘
   ```



4. 转账
   - 转账跟(3 单独部署合约钱包)主要区别就是在于UserOperation::callData , 不再重复画图

5. 权限验证
   - 可以使用EIP-1271标准，之前考虑的中间人攻击其实在无后端的情况下无需考虑。



其他信息: 

关于paymaster:由于完整的paymaster的实现非常复杂,而且可能需要商业模式,建议先期版本,我们先实现一个仅限ETH的用户自主paymaster, 大概运行方式为:

1. 用户打开我们的paymaster质押网页,连接其他现有EOA钱包(例如metamak)
2. 用户输入他的contract wallet 地址,以及输入想要质押的ETH数量
3. 用户的ETH锁定在我们的主paymaster合约中,只要是这个用户使用contract wallet操作,他所有的gas费都从我们的主paymaster的他的质押余额中扣除(当然可以随时解除质押 并提取ETH)


关于账户恢复:只要有原始合约部署源码就可以退到出contract wallet 地址,其中合约源码包含用户的公钥,但是如果用户把原始的公钥丢失(账户权限没有丢失,例如他更改了新的密钥,并把原来旧密钥遗失) 而且 contract wallet 地址也忘记,这时他是无法知道他原来的contract wallet地址的,除非他能在自己电脑上找到其他记录或者问知道他钱包地址的朋友.基于这个原因,传统EOA钱包的私钥/助记词模式是不能完全适用的,例如需要定义新的格式,每次导出私钥时要同时导出钱包地址.
