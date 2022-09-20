
# Progress of SoulWallet
+ English for international communications.

## Meeting and notes
+ One by one host the meeting and take notes.
+ Turn: ![turn](dev-docs/turn.png)

### TODO and check
#### 1.Paymaster design and solution : Daivd? Cejay?
#### 2.Bundler design and solution : Daivd? Cejay?
#### 3.Mask's old meeting record: jiajun
#### 4.Talk about the 3 risk areas and 6 significant risks or chanllenges: jhf and xuri

### 8-1
+ kick off 
+ begin to design

### 8-9
+ note:
```
Create senario, activate senario，discuss tomorror and produce the fake method.
Paymaster ability：Testnet and pension for gasfee，paymaster to pay gasfee，0Xswap ERC20 Token
```

### 8-17
+ Security center diagram discussion.
+ Frontend 60%
+ More detail: https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/dev-docs/security-center-solution.md

### 8-29
+ Social recovery sequence diagram discussion.
+ More detail: https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/dev-docs/Social-recovery-solution.md

```
contract_wallet_address，new_owner_address，change the contract wallet owner method's parameter.
Add method: getRecoveryStatus，for Robbie(frontend)
TODO: close recovery and clear the unfinished recovery record ,has not added yes
TODO: and keep compliance on contract level.
TODO: delete and edit, 2 of 4 APIs about guardians' CRUD
API add method: addGuardian（Robbie invoke after ABI return add guardian successfully ）
API add method: getGuardianStatus
Deployment： vercel first, haket？
```

### 9-1
+ host: @Robbie
- welcome Xuri to join the team
+ xuri(Tencent) and zhuxiao(Goolge) joined the dev group.
+ A quick introduction to the SoulWallet.

### 9-2
+ host: @Robbie
+ Technical review 
```
+ API
- send email
- save latest guardian list

+ Contract
- Activate wallet
- guardians(list, add, remove)

+ Design 
- Sign transaction modal
- Send

+ Product
- assets erc20 whitelist

Frontend
- activity history, click redirect to scan
- save name locally
- cache guardians list

Lock wallet
Initiate transaction page
Nobody pays-show normal gas fee
-Paymaster-show payer+0 gas fee
ERC-20 token list can be written to death.
Make up:
1. when adding or decreasing the guardian, it is mainly to interact with the contract. after the completion, call back the API and send the latest email, wallet address and guardian list to the API for storage.
2. When opening the guardian, you can initiate a call, send the local one to the API, and keep the synchronization updated.
3.API method name update_guardians
```

### 9-6
+ host: @surrvivor
+ 1> Self check

```
David, uups proxy with openzepllin, init code replace with proxy, testing.
cejay, edit the backend of Robbie: example added, parse opcode to object for fronted.
jiajun, upgrade the figma of recovery flow: https://www.figma.com/file/pLBiwLUILaudvLxVmo7Msd/ERC-4337_Soul-Wallet?node-id=899%3A251
xuri: risk question, to be discussed
zeno: add design :https://www.figma.com/file/pLBiwLUILaudvLxVmo7Msd/ERC-4337_Soul-Wallet?node-id=899%3A251, fix signature page, TODO: transfer jiajun's figma into page
Robbie: signature method? personal sign or signV4? jiajun: sign msgs notify todo
finish half of create wallet procedure, it is ok.(activate need paymaster, bundler).
Survivor: xuri joined security center , look forward to next stage.
Xuri: some questions and alignment schedule,backend will delivery on 9-15
TODO: we will build a testnet and mainnet endpoint to virtually run contract for security testify.
```
+ 2> Risk
+ Xuri joined and improve the speed and down the risk of progress.
+ 3> Astrox meeting, record online video for 1.5 hour.
+ 
+ ### 9-8
+ host: @jiajun
+ 1> Self check: 
```
Jiao: beanstalk effect okay；; Basic technology stack OK; Realize with the rising sun from front to back; 9.15 All APIs can be written;

Shengjie: The simplest version of Paymaster can be realized in these two days;

David: entry point is changing, and poc is based on the audited version;

Robbie: The implementation of zeno core design draft is almost finished.

Zeno：wallet recovery design draft has been completed; To be supplemented by edge case.

Xuri: look at the available schemes in the database; The security scheme is tentative JWT, and the back-end is developed with jiao.

Todo: Look for mask related videos.
```
+ 2> Milestone check: 
+ The progress seems ok, we will hit the schedule.
+ 3> Question fast discuss:
+ we hold a quick meeting in the morning.
+ ### 9-9
+ host: @xuri，survivor
+ Talk about backend dev
```
1. the generation and communication mechanism of 1.JWT, todo, and robbie confirm
2. Every time guardian signs on the chain? Holy communication = save, two have been changed, to be confirmed.

3.guardian setting will mainly store contracts on the chain in the future, and the security centers will be synchronized to be communicated.
4.response I changed the format and then changed it.

5.add guardian setting in user obj
```
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 9-13
+ host: @jiajun
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
```
Shengjie: parse opcode and prepare to be weth paymaster/bundler.
Huifeng: back-end method has been defined; Account related method is expected to be completed today; guardian； It is expected that it will be ready this week, and continuous debugging will begin next week;
David: You can watch paymaster/bundler related with shengjie;
Robbie: update the new UI/ lock/ unlock (consistent with metamask logic); The variable window.soul； can be injected; Pop-up scheme has been confirmed;
Xuri: the mailbox verification part of the interface is completed, come down with the front-end liantiao；;
Zeno: official website homepage design,+waitlist;
I: yc has submitted it; Ef to hand in tomorrow;

Front-end: Let's talk about it later.

Alignment progress/expectation
Paymaster/bundler design document

On the 16th, comprehensive joint debugging began;
```

+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 9-15
+ host: @??
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 9-16
+ host: @zhangshengjie
+ zhangshengjie:WETHPaymaster now is draft, the user can use weth pay gas when deploy wallet(will different wallet address on different chainid,but can solved after poc). and build a [ethereum event listener](https://hub.docker.com/r/cejay/ethereum-events)
+ jiao:Security center completed,to be in integrated test state
+ robbie:signature pop-up window and notification logic completed, @Jiajun needs to confirm the notification logic again
+ xuri:change website host to our domain name.
+ david:check out wethpaymaster this weekend.
+ zeno:use zero-code to build official website.
+ jiajun zeng:gas fee problem, POC does not allow users to customize gas fee.

### 9-17
+ host：jhf
+ Debug and code review

```
Evening API joint debugging +review note:

1.code returns

Fix, wait for the rising sun pr merge

2.page paging problem (all scenarios)

Todo, it's not resolved this time.

3.email and recovery record

Email has been added in model, wallet address has been removed this time, and submission requirements will be seen in the future, half of todo, to be seen, xuri.

4.server side

Todo, you need to add a trigger method of paymaster, and call the http method of paymaster with parameters.

5. Improve the array index mode of add guardian

todo，jhf

6.package.json, node.js and npm versions are written

todo，xuri

7.soulwallet addon domain, plus https

todo，xuri

8. Universal verification code

todo，888888，xuri

9. Add a delete guardian api

todo，jhf

10. code+email of addaccount is generated directly.

Todo, improve addAccount,jhf

11.code+AddRecovery improvement

todo，xuri

12. common-util api of jwt

Todo, xuri, added in two places (app.js has comments)

13. Future todo

Or lost JWT problem after changing computers.
```
+ Check it later

### 9-20
+ host: @zeno?
+ 1> Self check: 30 seconds to share your dev progress and your weekly target comparison.
```
host: 
@ZENO

1.debug time：start from 20:30 20/09
2. 
@Jiajun Zeng
 slogan and description
3. 
@ZENO
 homepage web design
 ----
progress  plus:
1.addRecoveryRecord, need to check the duplicate, and return that it has been submitted.

todo，xuri

2.JWT middleware verifies whether JWT is legal.

xuri，todo

**3.code+AddRecovery improvement * *

todo，xuri

**4. Add a delete guardian api**

ok，jhf

**5.server side * *

Todo, jhf, you need to add a trigger method of paymaster, and call the http method of paymaster with parameters.

**6. Improve the array index mode of add guardian * *

ok，jhf

7.fetchRecoveryRecords, you need to add a query guardian-setting.

Returned to Robbie: total: 5, min: 3, and now 2 have been signed

ok，jhf

```

+ 2> Milestone check: the risk of reaching the month or weekly target and how to fix.
```
437 Follow-up Plan

-Enter the joint debugging stage of all modules, and be online for 2-3 hours every night (robbie+jhf+ Rising Sun+Holy+others are online at any time). The goal is to complete the joint debugging before 9-30, and 80% of all problems arising will be solved.
-Related domain names (jiajun+robbie+xuri), publishing (holy +xuri+ plugin Robbie? ), presentation preparation (jiajun+all), and preparation for list(all) begins before the festival, with division of labor.
-recovery process demonstration, dapp interaction (1271)? Do plug-in support? Mobile phone client?
-App's Astrox cooperation is very good, ABI, API and process are open to them, the target APK version is guaranteed, the beta version of iOS is released, and the process and plug-in version are 80% consistent.
-Conduct a demo demonstration simulation internally during the National Day.
-other TODO should be pushed forward, and there should be no action or any feedback week after week.
After-10-10, it is planned to carry out two weeks of product roadmap design+technology stack exploration pre-research, and determine the goal and play method of the next iteration cycle.
-Start the second iteration cycle (3 months) at the end of October, and maneuver for one week.
-After mid-October, Rory will look at his situation and plan to work part-time in the whole stack (front and back work). Others will look at target delineation and technology stack exploration, and the visual inspection team will not make major adjustments.437 Follow-up Plan

-Enter the joint debugging stage of all modules, and be online for 2-3 hours every night (robbie+jhf+ Rising Sun+Holy+others are online at any time). The goal is to complete the joint debugging before 9-30, and 80% of all problems arising will be solved.
-Related domain names (jiajun+robbie+xuri), publishing (holy +xuri+ plugin Robbie? ), presentation preparation (jiajun+all), and preparation for list(all) begins before the festival, with division of labor.
-recovery process demonstration, dapp interaction (1271)? Do plug-in support? Mobile phone client?
-App's Astrox cooperation is very good, ABI, API and process are open to them, the target APK version is guaranteed, the beta version of iOS is released, and the process and plug-in version are 80% consistent.
-Conduct a demo demonstration simulation internally during the National Day.
-other TODO should be pushed forward, and there should be no action or any feedback week after week.
After-10-10, it is planned to carry out two weeks of product roadmap design+technology stack exploration pre-research, and determine the goal and play method of the next iteration cycle.
-Start the second iteration cycle (3 months) at the end of October, and maneuver for one week.
-After mid-October, Rory will look at his situation and plan to work part-time in the whole stack (front and back work). Others will look at target delineation and technology stack exploration, and the visual inspection team will not make major adjustments.

```
+ 3> Question fast discuss: technical questions and solution to discuss.
+ Copy these to next meeting notes.

### 9-22
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
