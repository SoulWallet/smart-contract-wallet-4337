

## Role and job
### PD
+ user senario define and ligic define @jiajun

### PM
+ service for the team delivery @jhfnetboy

### Backend+Security center
+ Email verify  Security center, backend job @jhfnetboy
+ 
### Soul wallet
+ @zeno UI,figma 
+ @robbie plugin and invoke js sdk

### wallet contract 
+ core contract @ding  @cejay
+ 
### 4337 js SDK
+ signature and js sdk @cejay @ding 
### paymaster and bundler
+ server side coding
+ @cejay @?
+ 

## progress
+ 8-1
+ kick off 
+ beigin to coding

8-9
+ note:
+ 1. Create senario, activate senario，明天过，争取场景讨论清楚，技术实现伪函数
+ 2. Paymaster ability：测试网，补贴ETH，paymaster代付；正式网络优先级P2，0X协议swap ERC20 Token

### Dev meeting 8-1? Template can be copy
+ 1. host: jhf
+ 2. Action list
+ 1> Self check
+ slef check the progress is ok and show something(like results, prs or graph or anything)
+ Plugin Frontend: page will be ok on Tuesday, Robbie,Rory?,
+ https://github.com/proofofsoulprotocol/soul-wallet-plugin
+ Plugin Hooks: will be draft define in monday, surpport basic hooks like utils, contact common query, jhf, Rory, cejay
+ https://github.com/proofofsoulprotocol/soul-wallet-plugin/tree/main/src/sdk
+ Backend Service: some basic service like send email, jhf,
+ https://github.com/proofofsoulprotocol/soulwallet-backend
+ Wallet Contract Core: usercase support, David, cejay
+ https://github.com/proofofsoulprotocol/soul-wallet-contract
+ Wallet Core Lib(js SDK for Plugin invoke): following the contrace core, support user case to invoke, cejay
+ https://github.com/proofofsoulprotocol/soul-wallet-corelib
+ Wallet Paymaster: support user case, design and dev, cejay, David
+ https://github.com/proofofsoulprotocol/paymaster-server
+ 
+ 2> Question fast discuss
+ jhf: hooks technical Q
+ 插件的sdk，需要定下各个场景需要调用的链上交互，然后@0xRory rory需要帮忙说下常规的thirdweb hooks调用
+ 我看了https://portal.thirdweb.com/react/react.useedition，一个是具体使用实例没有说，只给了返回的对象
+ 另外说建议不要生产环境，我们要讨论下
+ 
+ 3>Milestone check
+ 8-30: 
+ 1>create\ activate\reovery basic flow will be done in draft, some difficult knot can be delay, but not more than 3 dots.
+ 2>The technical design docs draft 0.1 make into gitbook? for early user to get basic information (or investors?), some Q&A like Aliance asked.
+ 3>find the grant sponsor or other money and talking in progress at least, we will check for Plancker's help to finish it or not.
