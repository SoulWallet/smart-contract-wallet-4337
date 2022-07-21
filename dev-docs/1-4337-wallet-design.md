## Realization of contract wallet MVP based on Argent mode + EIP4337 protocol

- This article analyzes wallets and landing scenarios from the perspective of application modules, so as to determine an evolvable business architecture.
- Then complete the splitting, refinement and behavior definition of the scene, and provide the definition and constraints for the whole system.
- In essence, three parts of the work are completed: conceptual, logical and part of the physical design work content.

### 1. MVP functional scope, for external users

- Jiajun is in charge, everyone will add together
- Anyone can download the Chrome plugin for free and accept assets using their own contract wallet address (no need to be established in advance, automatically created).
- Anyone can view all the source code of this wallet from github to ensure that they can check the security, or they can build their own plugins from the source code.
- Different networks (mainnet, Arbi, OP) can be selected to link different EntryPoints, but the wallet address can remain the same?
- Basic functional scenarios where wallets can be used:
- Get: Receive ERC20 or ERC721, ERC1155 and other Token assets sent from any EOA wallet or Contract wallet.
- Send: Transfer the above assets used by yourself to any EOA or Contract wallet Account address.
- Gas: Transfer currently needs to store a certain amount of ETH in advance to pay for the gasfee of its own contract wallet transaction, and will introduce paymaster in the future.
- Dapp: To connect and use Layer2 DApps normally, DApps need to reference the SDK provided by 4337, so as to adapt to the signature login and transaction initiation of the 4337 wallet.
- Recovery: Select Guardian (the default 4337wallet official team is the first one), and actively select Recovery at any time (send to Guardian via link)
- Programming: Currently, only the daily quota module is provided to be loaded into the contract wallet, and this function will be expanded in the future.
- Other regular Wallet functions, such as transaction viewing (link to scan url), will not be repeated here.

### 2. The use form, network and basic requirements of MVP

- - Jiajun is in charge, everyone will add together
- Regular versions of Webkit/Blink kernels such as Chrome, Safari, and Edge support the Chrome plug-in mechanism. In the future, plug-ins such as Brave and FF will be provided (essentially the same).
- At present, there is only plug-in mode, and in the future, we will consider Page mode, mobile terminal, and PC terminal.
- If there is a relay, it needs to be set up at home and abroad to provide basic transaction underlying communication support.
- Basically follow the usage habits of Metamask (need to analyze, what path-dependent habits are there).

### 3. MVP scene and function point dismantling

- Jiajun is in charge, everyone will add together
- Based on the above scenario description, let's define which scenario cases are included in MVP V0.1, how the scenario process will occur, and what atomic actions are involved.

#### Obtain

- Visit the *** URL, provide links to each store, or download and install it yourself to obtain the corresponding browser plug-in, and complete the acquisition after installation.
- Need product design details

#### initialization

- After 3 seconds of initialization, you will immediately have your own contract wallet address for operations such as receiving money.
- Tips for enhanced security: Setting up processes such as Guardiand
- Need product design details

#### Get

- Copy the address, send it to others, let others make money
- After the transaction is successful for others, the wallet will prompt you to receive the payment. Click on the prompt to view the transaction details. Different ERCs will give space for display in the future! Especially NFT and SBT!
- Need product design details

#### Send

- Copy someone else's address and send it on the wallet interface
- There is no big difference between traditional wallets, submit, send, confirm interface, more coverage? Cancel? The choice of the previous transaction (before the chain)
- Need product design details

#### Gas

- For all scenarios involving gas payment, there is an additional check option: pre-store gas to Entrypoint, and there are two ways to pay gas: use Entrypoint or the token in the current wallet (eth, erc20, nft?)
- No big difference between traditional wallets
- Need product design details

### 4. Business Architecture (Core Scenario Abstraction + Future Prediction)

- This article extracts the invariable content: customer demands, problem-solving scenarios, interactive actions in scenarios, and detailed descriptions of interactive actions. Regardless of 4337 or other protocols, the upper-level business scenario services will be provided based on this business architecture. Jiajun+jhf is responsible for .
- Throughout all scenarios are Account (Address, balance, setting (for example, Entrypoint is used to pay gas by default, is the daily limit enabled?)), Token (operated assets), Gas (gasfee that needs to be paid in Tx)
- DApp interaction process
- In the future, EVM will be directly upgraded to support contract wallet in the form of OpCode, and the core business scenarios such as init deploy, verify, approve, transfer, accept will remain unchanged, but the contract address implemented by the original Entrypoint will be replaced by the direct contract code, and the transformation method will not be too complicated. .
- This part must be communicated consistently with the product, and the core business objects, business behaviors, specific actions, core entry and exit parameters, and future business scenarios (roadmap prediction and architecture migration responses) must be extracted.

### 5. Action and API interface definition of the main scene (pseudo code)

- It is necessary to disassemble the use case diagram and draw the sequence diagram of the Action, jhf+cejay is responsible for
- Every time sequence diagram interaction, either API, or on-chain
- This part is connected with cejay's technology
- There will be some columns of diagrams, first on paper, and then submitted to draw.io

### 6. Contract part: Wallet based on 4337 standard, only one item is added: daily transfer limit, which needs to be customized

- For the separate document analysis of the contract part, David+cejay is responsible?
- Based on the following judgments:
- \1. The 4337 wallet contract comes from the protocol implementation of 4337 (there is a simple demo, but we need to expand it into a wallet contract with basic functions)
- 2.4337 The wallet contract needs to be deployed, and gasfee needs to think clearly about the payment path: advance payment? prepaid?
- 3.4337 All the external publics of the wallet contract are dismantling of the interaction behavior from the sequence diagram, and it is necessary to clearly define the entry and exit parameters and other API conventions.
- 4.4337 The useroperation of the wallet contract needs to be aligned with the Entrypoint of the test network, and can run through the completed basic business Action.
- 5.4337 The wallet contract needs to think clearly about how Bundler is embodied? Or do we just submit to the EP and not consider it?