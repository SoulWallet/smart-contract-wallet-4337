/*
 * @Author: jhfnetboy 
 * @Date: 2022-07-22 10:17:18 
 * @Last Modified by: jhfnetboy
 * @Last Modified time: 2022-07-23 16:03:06
 */
  
# 4337 Technical Implementation Analysis
+ This article will analyze and preview the entire main technical process from the perspective of technical implementation.
## Structure diagram of main scenarios
+ ![architecture](4337-product-architecture.drawio.png)
+ We can find many Entities and Lines which represents objects and relations.
+ Now we give a deification of this Objects and Relations.
### User
+ Who focus on some features of Smart Contract Wallets.
+ ![features](feats.png)
+ He can easily find the Chrome extension in official links or search engines.
+ Follow the next to install and fast create his account.
+ So he must want the highlight words to tell him what you have got and what benefits you are enjoying.
+ Set his **guardians** and remember it to reset the private key.
+ His private key will save in local machine.
### Plugin
+ It will not be very large and automate to update to new version.
+ It will give the owner some warnings or notifies to give advice and selections.
+ It give save mode or expert mode or some other modes for saving your time.
### Entry Points
+ It will be EF official address and can be directly verified.
+ We will give a overview of the abilities.
### User
### User
### User
### User
### User
### User

## The whole process of signing
## Other signature algorithms
## EOA and EIPS
+ We find the EIPs implementing a basic EOA wallet.
### 165
+ To receive the NFT assets.
+ https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
### 1193
+ To interact with the browser and implement a wallet
+ https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
## Account abstract EIPs
### 1217?
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1217.md
### Argent about
inpage.model.ts

EIP-747:

https://github.com/ethereum/EIPs/blob/master/EIPS/eip-747.md

EIP-3085

https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md

EIP-747:

https://github.com/ethereum/EIPs/blob/master/EIPS/eip-747.md

EIP-3085

https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md

wallet.service.ts

from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2645.md

m / purpose' / layer' / application' / eth_address_1' / eth_address_2' / index

## EOA initiates transaction
## Transaction Links and MEVs
## 4337 Protocol Interpretation
## Entryporint and Bundler
## 4337 Tx execution process
