## 4337后端技术方案

### 1.安全中心定义
+ 验证Owner、存储关系、恢复Key、配置Guardian。
+ 所有API调用，基于OAuth2，提供基础调用Demo
+ 本次采用AWS的FAAS（Lambda）来构建应用，对于前端友好，RestFull API，后端只需要写业务代码
+ 可以抽象业务代码迁移到其他云服务或者自行构建分布式的Docker服务
#### 验证Owner（目前只验证Email）
+ 首先在创建钱包时，进行简单的Email验证，提交email给安全中心，安全中心返回随机数，回填随机数ok则证明Email控制归属ok。
+ 
```Function: verifyEmail

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: addr, destination email address

Response：{method: verifyEmail, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, nofity formate same as Response
```
+ 目前验证owner适用于恢复钱包时的email验证场景，安全中心check Email是否有对应钱包和guardian记录，如果有，则向email发送一个随机码，回填后则证明email归属ok，可以执行recovery下一步。
```Function: verifyOwnerMail

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: addr, destination email address

Response：{method: verifyOwnerMail, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, nofity formate same as Response
```
----
```
Function: verifyRandomNum

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: rNubmer, customer input random number

Response：{method: verifyRandomNum, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response
```
---

#### 存储关系
+ 创建钱包场景，当钱包地址通过计算从合约端获取后，就需要调用本api，把email和合约钱包地址配对存储到安全中心。
+ 如果设置了guardians，需要把guardians数组json方式存储到上述email+合约钱包地址关系中
+ 从安全角度看，需要对存储的钱包地址进行加密？并非传输加密（传输加密采用OAuth2协议），是存储的就是加密内容，待定
+ guardians数据结构
+ [{"guardian_address":"EOA or contract wallet address",
+ "guardian_signature":"public_key_signature to be verify"},{}]
```
Function: saveWalletAddress

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: email_address, contract_wallet_address,  guardians, 

Response：{method: saveWalletAddress, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response
```
##### 恢复Key场景
+ 就是social recovery场景中的几个动作：发起恢复申请、生成恢复链接（给guardian且唯一）、收集恢复签名、发起恢复交易。
+ 客户点击恢复钱包，验证email完成后，在本地生产一份新的密钥对，并且提交安全中心（email+私钥hash）。
+ 这里要一个时序图+数据约定；
+ 
+ 安全中心收到申请，存储下email+私钥hash，生成唯一的url（有实效），安全中心显示guardian list。
+ 可以用社交媒体分发给自己guardian（本期可不做）。
+ 有一个简易流程图：
+ todo
+ guardian点击url登陆或者直接访问安全中心，验证guardian的签名是否和存储一致。
+ 一致则写入一个setting数组并check是否满足签名数量，例如2/3，满足则进行下一步，参考简易时序图。
+ 
+ 收集签名满足最低要求，则失效恢复链接，清空email对应的恢复记录，让后续进入的guardian无法参与恢复。
+ 发起一个Tx到钱包合约还是paymaster？，提交合约钱包地址+新私钥hash+guardian签名数组（几个），二次验证后。
+ paymaster扣除合约钱包内gasfee，然后钱包合约执行替换私钥的tx，完成后插件端要有状态显示（安全中心获得直接tx执行结果）。
+ 要有时序图+流程说明：
+ ![recovery-sequence-diagram](recovery-sequence-diagram.png)
+ 
```
Function: recoveryRequest
REST  API   :https://router.com/gateway/method-name?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: email, newKey(hashed)

Response：{method: recoveryRequest, code: 200, param: {guardian-list with status}, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response

-----

Function: fetchRecoveryRecords
REST  API   :https://router.com/gateway/method-name?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: guardian's key hash, or owner's email

Response：{method: fetchRecoveryRecords, code: 200, param: {guardian-list with status}, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response

----

Function: updateRecoveryRecord
REST  API   :https://router.com/gateway/method-name?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: guardian's key hash,or owner's email

Response：{method: fetchRecoveryRecords, code: 200, param: {guardian-list with status}, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response

----

Function: triggerRecovery
REST  API   :https://router.com/gateway/method-name?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: guardian's key hash lists,wallet address

Response：{method: triggerRecovery, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response
```
##### 配置Guardian
+ 本次先不开发此模块。
+ default guardian，是SoulWallet官方组织管理的一个合约钱包，钱包本身有多个guardian，定期更换私钥。
+ 会执行一些默认的基本安全策略，例如客户忘记设置guardian，创建合约钱包后，会自动添加的官方默认guardian。
+ 如果客户忘记私钥，只记得email，则可以通过官方guardian快速恢复。
+ 以上要有一个流程图；
+ 
+ Guardian设置目前只存储于安全中心，方便客户更改guardian配置，未来会用**不同子合约形式**，写入到合约中的安全配置
+ {"max_gNumber":10, "min_gNumber":6, "verify_method":"signature", 
+ "guardians":[
+   {"guardian_address":"EOA or contract wallet address",
+   "guardian_signature":"public_key_signature to be verify"},{}]
+  }
+  verify_method, 未来支持例如twitter、 FB、微博、Email等Web2验证方式，目前只支持签名方式


### 安全中心技术方案讨论
+ 结论是本次会用较少配置的Lambda方式，未来技术栈待定
#### 简易评估过程
+ 1.Docker化，内部Go手写
+ 本次后端力量不足，Go和Docker技术栈需要Rory后续加入来补足
+ Rory时间要9-15之后才可以兼职加入，时间上来不及

+ 2.AWS Lambda，只写核心，抽象后可以跨云迁移,FAAS
+ 评估过了Lambda，大约3天可以上手开发，后端工作量增加了几倍
+ 需要Rory9-15加入后快速支持，否则10-15之前无法完成

#### 后端开发上手指南
+ AWS Lambda参考这里：https://mp.weixin.qq.com/s/NjeB5FIwN9bpAZLuMHsWrA
+ 所有返回的消息体json结构：
```
{   
    method: triggerRecovery, 
    code: 200, 
    status : OK, 
    params: {data structure},
    msg: "msgs returned",
    hash: hash
}
or
{   
    method: triggerRecovery, 
    code: 4001, 
    status : Error, 
    params: {data structure},
    msg: "msgs returned",
    hash: hash
}
4001,数据不合理或者方法不存储，客户端调用问题；具体看返回的数据和msgs。
5001，Server端方法执行出错，服务器端问题；具体看返回的数据和msgs。
```

#### 安全分析
+ 1.如果服务器被Hack，所有数据泄露，则用户email和合约钱包地址、guardian公钥签名hash被泄露，不会直接造成客户损失。
+ 2.如果服务器被劫持，则fake API会获取客户的上述数据，但签名是hash后的，无法重用？
+ 3.如果默认Guardian被hack了私钥hash或者私钥，则对于只有一个guardian的是一个风险，因此需要至少2guardian是比较安全。
+ 4.因此对于大于10000U的客户，建议Web2+Web3 guardian都设置，最好3/5，这样更安全
+ 5.且自己记录到断网手机上钱包和guardian地址，恢复时mac+chrome环境下恢复。
+ 6.另外私钥可以定期恢复一次，设置单日限额+动帐预警，这样基本控制了最小损失，可以被盗后及时更改私钥，恢复控制权。
+ 7.大额账号，便利性和安全性都要，可以购买经过官方审计的安全模块+安全服务。




