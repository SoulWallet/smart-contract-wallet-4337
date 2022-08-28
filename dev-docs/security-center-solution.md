## 4337后端技术方案

### 1.安全中心定义
+ 验证Owner、存储关系、恢复Key、配置Guardian。
+ 所有API调用，基于OAuth2，提供基础调用Demo
+ 本次采用AWS的FAAS（Lambda）来构建应用，对于前端友好，RestFull API，后端只需要写业务代码
+ 可以抽象业务代码迁移到其他云服务或者自行构建分布式的Docker服务
#### 验证Owner（目前只验证Email）
+ 目前验证owner适用于创建钱包和恢复钱包时的email验证场景。
Function: sendVeriyMail2Addr

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: addr, destination email address

Response：{method: sendVeriyMail2Addr, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, nofity formate same as Response

----

Function: verifyRandomNum

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: rNubmer, customer input random number

Response：{method: verifyRandomNum, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response

---

#### 存储关系
+ 创建钱包场景，当钱包地址通过计算从合约端获取后，就需要调用本api，把email和合约钱包地址配对存储到安全中心。
+ 如果设置了guardians，需要把guardians数组json方式存储到上述email+合约钱包地址关系中
+ 从安全角度看，需要对存储的钱包地址进行加密？并非传输加密（传输加密采用OAuth2协议），是存储的就是加密内容，待定
+ guardians数据结构
+ [{"guardian_address":"EOA or contract wallet address",
  + "guardian_signature":"public_key_signature to be verify"},{}]

Function: saveWAddress

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: email_address, contract_wallet_address,  guardians, 

Response：{method: verifyRandomNum, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response

##### 恢复Key场景
+ 就是social recovery场景中的几个动作：发起恢复申请、生成恢复链接（给guardian且唯一）、收集恢复签名、发起恢复交易
+ 客户点击恢复钱包，验证email完成后，在本地生产一份新的密钥对，并且提交安全中心（email+私钥hash）
+ 这里要一个时序图+数据约定
+ 
+ 安全中心收到申请，存储下email+私钥hash，生成唯一的url（有实效），安全中心显示guardian list
+ 可以用社交媒体分发给自己guardian（本期可不做）
+ 有一个简易流程图
+ 
+ guardian点击url登陆或者直接访问安全中心，验证guardian的签名是否和存储一致
+ 一致则写入一个setting数组并check是否满足签名数量，例如2/3，满足则进行下一步
+ 有一个简易流程图
+ 
+ 收集签名满足最低要求，则失效恢复链接，清空email对应的恢复记录，让后续进入的guardian无法参与恢复
+ 发起一个Tx到钱包合约还是paymaster？，提交合约钱包地址+新私钥hash+guardian签名数组（几个），二次验证后
+ paymaster扣除合约钱包内gasfee，然后钱包合约执行替换私钥的tx，完成后插件端要有状态显示（安全中心获得直接tx执行结果）
+ 要有时序图+流程说明

##### 配置Guardian
+ 本次先不开发此模块
+ default guardian，是SoulWallet官方组织管理的一个合约钱包，钱包本身有多个guardian，定期更换私钥
+ 会执行一些默认的基本安全策略，例如客户忘记设置guardian，创建合约钱包后，会自动添加的官方默认guardian
+ 如果客户忘记私钥，只记得email，则可以通过官方guardian快速恢复
+ 以上要有一个流程图
+ 
+ 2/3,4/6,guardian setting和ratio
+ Guardian设置目前只存储于安全中心，方便客户更改guardian配置，未来会用**不同子合约形式**，写入到合约中的安全配置
+ 



### 安全中心底层技术方案讨论
+ 结论是本次会用较少配置的Lambda方式，未来技术栈待定
+ 简易评估过程
+ 1.Docker化，内部Go手写
+ 本次后端力量不足，Go和Docker技术栈需要Rory后续加入来补足
+ Rory时间要9-15之后才可以兼职加入，时间上来不及

+ 2.AWS Lambda，只写核心，抽象后可以跨云迁移,FAAS
+ 评估过了Lambda，大约3天可以上手开发，后端工作量增加了几倍
+ 需要Rory9-15加入后快速支持，否则10-15之前无法完成




