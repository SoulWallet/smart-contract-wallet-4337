
# Progress of SoulWallet
+ English for international communications.

## Meeting and notes
+ One by one host the meeting and take notes.
+ Turn: ![turn](dev-docs/turn.png)
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
+ host: @Robbie
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @zeno
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.
+ ### 8-30
+ host: @survivor
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.
+ ### 8-30
+ host: @Davidding
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @cejay
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @rory?
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @jianyu?
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @zeno?
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 8-30
+ host: @zeno?
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

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
+ @cejay @Davidding
+ https://github.com/proofofsoulprotocol/paymaster-server

### Mobile Apps
+ In iOS and Android and other platforms, we invite our companion team: Astrox.
+ To finished the Mobile apps based on what we have done.
