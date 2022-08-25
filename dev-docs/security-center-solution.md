## 4337后端技术方案

### 1.安全中心初步定义完成
验证Owner、存储关系、恢复Key、配置Guardian。

#### 验证Owner（目前只验证Email）
+ 目前验证owner用于创建钱包和恢复钱包时的email验证场景。
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
+ 从安全角度看，需要对存储的钱包地址进行加密？并非传输加密，是存储的就是加密内容？

Function: saveWAddress

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID&hash=aabbcc

Method: post or get

Param: email_address, contract_wallet_address,  guardians, 

Response：{method: verifyRandomNum, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, notify formate same as Response

##### 恢复Key
+ 就是social recovery场景

##### 配置Guardian

2.Social Recovery 第一个MVP版本流程确认，未来可迭代。

3.项目组磨合4周后，协作有了一定提升，日常进度会议和check有效果。



安全中心底层技术方案讨论

1.Docker化，内部Go手写

2.AWS Lambda，只写核心，抽象后可以跨云迁移

哪种更去中心化？更高效？更开发工作量少？可扩展？有手机版的Docker容器了么？



