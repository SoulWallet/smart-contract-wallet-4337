### 4337项目设计分析阶段

#### 一个Layer2合约钱包的Q&A

1. 为啥不做Layer1的合约钱包？
   - 为快速上线，MPV产品仅支持一个L2（optimism/arbitrum).
2. Layer2的EntryPoint EF什么时间部署？这个是我们的依赖
   - 在正式部署之前，我们的开发测试可以基于我们自己部署的Entrypoint测试开发
   - 测试当然自己部署，需要确认EF部署的时间（方式？）
   - " It'll be deployed on the optimistic rollups as soon as it's ready." @yoav
3. 我们本次做的是最小可用钱包？需要定义面向客户的功能范围
   [design doc](1-4337-wallet-design.md)
4. 本次的技术方案选型
Solidity+React+Chrome插件（node），Relay用Go（如果架构确认做Relay）
5. 角色分工安排？
产品嘉俊，架构jhf，合约+后端cejay，前端+插件：待招募，全栈偏前端：拆分钱包前后工作量，6人左右小团队
6. 工作量评估：按优先级，拆分为5部分，在架构和设计完成后（预计3+1周左右），预留了3+2周开发+测试时间，这样下来大约3个月交付第一个版本的MVP
会拆分后给出干特图排期

7. 工程分析：5部分主要工作量
   1. 对EIP4337协议的实现，不同链，可能有不同的tricks。这里讨论下，cejay说有最基础的实现，包括基础的js调用，那只需要增加一个日限额部分合约以及对应设置和触发过程基于4337合约模板，生成我们的合约钱包的code。
      - 如果要实现日限额等高阶功能，我们可以参考下Gnosis，但是觉得可能这不是MVP版本的功能
   2. 适配DApp的wrapper，用来链接钱包，输出常规的provider等接口服务。这个重要是参考这里：165改进为1271，https://docs.argent.xyz/wallet-connect-and-argent，另外要考虑架构上的考虑。是在浏览器实现侧完成适配，还是轻量改造DApp（引用我们提供的sdk，给出接口），需要讨论确定。
      - EIP165是必须支持的（NFT收款的必要条件），EIP1271这个登录标准如果没有更大共识的标准EIP 我们也得实现
   3. 一个类似Metamask的Chrome plugin，包括relay服务（可定制，复杂）这个要基于Argent看，有多少能用的，协议和指令部分估计用不上，交互界面和业务流程可以参考，是重要的工作，深入研究代码后，拆解，再讨论一次。
   4. 一个用来示范如何连接使用wrapper的DApp demo。这个就用我们的ProofofSoul吧，也可以顺便改造一个版本
   5. paymaster，工作量，可以后置（GSN基础上改造）paymaster目前计划滞后，先用测试网，然后使用entrypoint的预存来完成gas支付，如果0.1MVP，就是需要先预存ETH到合约钱包 后面再把paymaster做好（第三方代付支付）

