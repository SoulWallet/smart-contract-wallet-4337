EIP-4337 Contract wallet core process [wallet core module]

1. initialization

   Generate private key -> Generate contract wallet address If the entrypoint address is determined, the contract wallet address is only related to the source code of the contract wallet. In general, the source code of the contract is a homogeneous format code, which will only be written at the permission verification place. Different public keys, from this point of view, the contract wallet address only depends on the user's control public key. The process of obtaining the wallet address is to first obtain the user's public key, splicing the contract source code, and then generate the contract opcode through solc [or do not use solc, It is implemented directly by replacing the hexadecimal public key stored in the opcode, which is simpler], and then use the following compatible local function to calculate the wallet address through opcode (initCode).

   ```
   address walletAddress = keccak256(abi.encodePacked(
                   bytes1(0xff),
                   address(entry point 合约地址),
                   salt,//可以为固定值 例如 0x0
                   keccak256(initCode)
               )
   );
   ```

   data flow:

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

2. Receipt Token

   - Receiving erc20 , you can receive money without actually deploying the wallet
   - Receiving erc721, etc., you can collect money without actually deploying the wallet

   ```
   对于实现了ERC165的token(例如erc721),使用safeTransferFrom()函数时往往需要确定收款合约中包含 supportsInterface(bytes4 interfaceID) 且返回正确的值时往往才能发送NFT,但是未部署的合约钱包对于NFT合约来说是一个外部账户(EOA),在部署之前没有任何限制的
   ```

3. Deploy the contract wallet separately

   Construct UserOperation

   ```
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

   flow chart:

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

4. transfer

   - The main difference between transfer and (3 deploying the contract wallet separately) is that UserOperation::callData , no more drawing

5. ASD

   - The EIP-1271 standard can be used, and the man-in-the-middle attack considered before is actually not considered in the case of no backend.

other information:

About paymaster: Since the implementation of the complete paymaster is very complex and may require a business model, it is recommended that for the early version, we first implement an ETH-only user-owned paymaster. The approximate operation is as follows:

1. User opens our paymaster staking webpage and connects to other existing EOA wallets (eg metamak)
2. The user enters his contract wallet address and the amount of ETH he wants to stake
3. The user's ETH is locked in our main paymaster contract. As long as the user operates with the contract wallet, all his gas fees will be deducted from his pledge balance of our main paymaster (of course, the pledge can be released at any time and ETH can be withdrawn)

About account recovery: As long as there is the original contract deployment source code, you can return to the contract wallet address, where the contract source code contains the user's public key, but if the user loses the original public key (the account authority is not lost, for example, he changes a new password) key, and lost the original key) and the contract wallet address is also forgotten, then he cannot know his original contract wallet address, unless he can find other records on his computer or ask a friend who knows his wallet address. For this reason, the private key/mnemonic mode of the traditional EOA wallet is not fully applicable. For example, a new format needs to be defined, and the wallet address must be exported every time the private key is exported.

MVP version:

The current maximum consensus of EIP-4337 wallet mvp version:

### "Easy to use and safe"

\#Ease of use:

1. No mnemonic required
   - Thinking of using a brain wallet? (Before, the BTC brain wallet was stolen in large numbers mainly because the random seed of the brain wallet was too simple at that time)
2. No native token required for current blockchain
   - Considering some complex problems of paymaster, whether it is possible to consider only using the test network in the mvp version, we subsidize the gas fee model to run through the main process, and then introduce opengsn and biconomy in the next version released to the official network to solve the gas payment problem

\#Safety:

1. Changeable control public key
   - Needless to say
2. socially recoverable
   - Specific paths to social recovery
     1. Simple and rude mode: directly write the public keys of multiple restorers into the wallet, and use the n-of-m mode to find the restorers directly through the social network when recovery is required, and ask the restorers to provide the signature of the specified message. The wallet owner submits a sufficient number of signatures to reset the control public key.
     2. More elegant mode: just write a randomly generated recovery public key into the wallet, and use the privacy calculation-secret sharing protocol to share the private key corresponding to the recovery public key to multiple recovery people through any social mode. When recovery is required, find n-of-m restorers directly, obtain their secret fragments, reorganize the private key through our wallet, and reset the control public key by submitting the designated signature of this private key by the wallet owner.

Status: There is no problem with the core technical analysis for the time being, and the development of wallet core (EIP-4337 wallet library) is being implemented

Question: In fact, it still needs to be refined. The reason for the refinement is that more people are required to invest professionally, such as the privacy computing secret sharing protocol mentioned above (if you choose this path), and brain wallet production (if you choose this path)