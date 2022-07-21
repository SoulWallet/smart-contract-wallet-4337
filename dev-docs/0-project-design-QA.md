### 4337 Project Design Analysis Phase

#### A Q&A for a Layer 2 contract wallet

1. Why not make a contract wallet for Layer 1?

   - For quick launch, MPV products only support one L2 (optimism/arbitrum).

2. When will the Layer2 EntryPoint EF be deployed? this is our dependency

   - Before the official deployment, our development tests can be developed based on our own deployed Entrypoint tests
   - Of course, the test is deployed by itself, and the time (method?) of the EF deployment needs to be confirmed.
   - " It'll be deployed on the optimistic rollups as soon as it's ready." @yoav

3. What are we doing this time is the smallest usable wallet? Need to define customer-facing functional scope [design doc](https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/dev-docs/1-4337-wallet-design.md)

4. This time, the technical solution selection Solidity+React+Chrome plugin (node), Relay uses Go (if the architecture is confirmed to be Relay)

5. Assignment of roles? Product Jiajun, architecture jhf, contract + back-end cejay, front-end + plugin: to be recruited, full-stack partial front-end: workload before and after splitting wallets, a small team of about 6 people

6. Workload assessment: divided into 5 parts according to priority. After the architecture and design are completed (about 3+1 weeks are expected), 3+2 weeks of development + testing time are reserved, so that the first delivery will be delivered in about 3 months. Each version of the MVP will be split and the Gantt chart schedule will be given

7. Engineering Analysis: 5 Major Workloads

   1. For the implementation of the EIP4337 protocol, different chains may have different tricks. Discussed here, cejay said that there is the most basic implementation, including basic js calls, it only needs to add a daily limit to some contracts and the corresponding setting and triggering process is based on the 4337 contract template to generate the code of our contract wallet.

      - If you want to implement high-level functions such as daily quota, we can refer to Gnosis, but I think this may not be the function of the MVP version
      - It can be discussed, but I feel that MVP realizes the basic functions of contract wallet + social recovery + programming (daily limit) is what MVP needs to do, but you can evaluate the workload and prioritize.

   2. The wrapper that adapts to DApp is used to link wallets and output regular provider and other interface services. This is important to refer to here: 165 is improved to 1271, 

      https://docs.argent.xyz/wallet-connect-and-argent, and architectural considerations should also be considered. Whether to complete the adaptation on the browser implementation side, or to lightly transform the DApp (refer to the sdk provided by us and give the interface), needs to be discussed and determined.

      - EIP165 must be supported (a necessary condition for NFT collection), EIP1271, the login standard, if there is no larger consensus standard EIP, we must also implement it
      - Sorry, I'm wrong, do you want 1271 to be compatible with 191? Or upgrade the original EOA signature protocol? I haven’t analyzed it in depth yet, and I see that signature aggregation needs to be implemented, which should be this part of the work. The wallet must match the signature algorithm set (including upgrading EOA to the contract wallet algorithm compatible with EOA?)

   3. A Chrome plugin similar to Metamask, including the relay service (customizable, complex). This depends on Argent, how many can be used, the protocol and instruction parts are estimated to be unusable, and the interactive interface and business process can be referred to, which is an important work. After digging into the code, tear it down, and discuss it again.

   4. A DApp demo to demonstrate how to connect and use wrapper. Just use our ProofofSoul for this, or you can make a version by the way

   5. paymaster, workload, can be post-installed (transformed on the basis of GSN) paymaster is currently planning to lag, first use the test network, and then use the pre-store of entrypoint to complete gas payment, if 0.1MVP, it is necessary to pre-store ETH to the contract wallet and then pay master Do it well (third-party payment)