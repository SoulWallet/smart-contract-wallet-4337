
# Progress of SoulWallet
+ English for international communications.

## Meeting and notes
### 8-1
+ kick off 
+ begin to design

### 8-9
+ note:
+ 1. Create senario, activate senario，明天过，争取场景讨论清楚，技术实现伪函数
+ 2. Paymaster ability：测试网，补贴ETH，paymaster代付；正式网络优先级P2，0X协议swap ERC20 Token

### 8-17
+ Security center diagram discussion.
+ Frontend 60%

### 8-29
+ Social recovery sequence diagram discussion.

#### Meeting notes
+ contract_wallet_address，new_owner_address，change the contract wallet owner method's parameter.

+ Add method: getRecoveryStatus，for Robbie(frontend)

+ TODO: close recovery and clear the unfinished recovery record ,has not added yes
+ TODO: and keep compliance on contract level.

+ TODO: delete and edit, 2 of 4 APIs about guardians' CRUD

+ API add method: addGuardian（Robbie invoke after ABI return add guardian successfully ）
+ API add method: getGuardianStatus

+ Deployment： vercel first, haket？

### 8-30
+ host: @xxxxx
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @xxxxx
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.
### Dev meeting 8-1 Template can be copy
+ 1. host: jhf
+ ![turn](dev-docs/turn.png)
+ 2. Action list
+ 1> Self check
+ slef check the progress is ok and show something(like results, prs or graph or anything)
+ Plugin Frontend: page will be ok on Tuesday, Robbie,Rory?,
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
## SoulWallet components and team's role
### PD
+ User scenario define and logic define by @zengjiajun, who was the summoner.
### PM
+ Service for the team delivery @jhfnetboy, who was a experienced guy on IT area.
### Plugin
+ https://github.com/proofofsoulprotocol/soul-wallet-plugin
+ Plugin Hooks: will be draft define in monday, support basic hooks like utils, contact 
+ common query, jhf, Rory, cejay
+ @zeno Our designer, UI,figma , a cool guy.
+ @robbie Frontend plugin and invoke js sdk, a good boy.

### Hooks
+ https://github.com/proofofsoulprotocol/soul-wallet-plugin/tree/main/src/sdk
+ Node.js npm package and signature and js sdk @cejay 
### Security center
+ Backend Service: some basic service like Email verify, recovery execution and more.
+ Security center and more, backend job @jhfnetboy, yeah, also a fullstack engineer.
+ https://github.com/proofofsoulprotocol/soulwallet-backend
### Wallet Contract Core
+ Wallet Contract Core: user case support,
+ @Davidding  a handsome dad who was a Solidity engineer.
+ @cejay ,a good man who was fullstack Web3 builder. 
+ https://github.com/proofofsoulprotocol/soul-wallet-contract
### Wallet Core Lib
+ Wallet Core Lib(js SDK for Plugin invoke): following the contrace core, support user case to invoke, cejay
+ https://github.com/proofofsoulprotocol/soul-wallet-corelib

### Wallet Paymaster
+ Wallet Paymaster: support user case, design and dev, contract coding
+ @cejay @Davidding
+ https://github.com/proofofsoulprotocol/paymaster-server

### Wallet Bundler
+ Now do few jobs on this, to be extended.
+ @cejay @Davidding, TODO

### Mobile Apps
+ In iOS and Android and other platforms, we invite our companion team: Astrox.
+ To finished the Mobile apps based on what we have done.
