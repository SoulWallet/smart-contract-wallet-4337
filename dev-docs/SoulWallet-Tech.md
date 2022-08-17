# SoulWallet Technical abstraction

## Modules
### 
+ 前端约定下调用格式、方法名、参数传递
+ 
+ Eamil verify service
Function: sendVeriyMail2Addr

REST  API   :https://router.com/gateway/sendVeriyMail2Addr?addr=123@gmail.com&accessID, hash

Method: post or get

Param: addr, destination email address

Response：{method: sendVeriyMail2Addr, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, nofity formate same as Response

----

Function: verifyRandomNum

Method: post or get

Param: rNubmer, customer input random number

Response：{method: verifyRandomNum, code: 200, status : OK, hash}

Notify: sync or Aysnc , subscribe notify, nofity formate same as Response