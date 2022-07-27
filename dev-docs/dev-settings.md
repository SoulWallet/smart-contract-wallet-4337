# Dev settings
+ env example
+ see file, more detail contact david.
### Gas analysis map
+ https://mm.edrawsoft.cn/app/editor/z7sI46yuwfvIpSVtTCMLX1KtVuF8KSjA?ivt=2AI6gPzk7sFyzCdKxBUQPsC5Web7EE25014?
邀请你加入MindMaster协同版文件“代付”一起协作
+ 对了，不使用paymaster也可以，用户有请求到我们服务器，我们直接bundle两个交易再发送
交易1：从我们的账户为用户合约钱包质押
交易2：正在执行用户合约钱包的交易
两个交易在一个userOperation数组里
+ 如果不用paymaster的话 钱包生成还挺复杂的 离线算出合约钱包地址 然后需要一个eoa地址 去entrypoint里面deposit to 一下生成的create2地址  然后构造useroperation交易 发到entrypoint里面

### 服务器离线签名 tx
+ https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/VerifyingPaymaster.sol

### Test addr
+ 我创建了一个测试网地址，打了20个测试ETH
地址：
0xeC9a6761a181C942906919Cc73C38de96C6FdFBD
私钥：
a6df89ed3e4f20e095f08730dd5435875ee6fa6e2b33bca5fb59f62afc06a56b

我发现调试多花的时间，很多都是因为我本地测试节点的问题[破涕为笑]
再调试就直接测试链弄了 ，上面的20个ETH就足够测试链上所有的测试啦 ，你测试的话也不用申请测试币了，直接用上面的地址就好 哈哈，我也用上面的地址测试