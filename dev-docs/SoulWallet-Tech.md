/*
 * @Author: jhfnetboy 
 * @Date: 2022-08-30 11:27:29 
 * @Last Modified by: jhfnetboy
 * @Last Modified time: 2022-08-30 12:29:18
 */

# SoulWallet technical abstraction
+ This document will show the technical solutions for team communications and partners' basic knowledge.
+ It will be modified timely.
## Conceptions
### EIP 4337
### Social recovery
### More we get

## Components
### Diagram
+ !


## Flow
## Technology
### Implementations
### Invoke method

### Data formate

## Scale and performance
## Security and risk
+ Welcome to give us any response for our MVP, or talking the detail of the product SoulWallet.
### Security center
#### 1. Risk:
It is a central application to service for the SoulWallet users, it a single point failure.
+ Bad: If the server is hacked and all data is leaked, the user's email and contract wallet address and guardian public key signature hash will be leaked, which will not directly cause customer losses.
+ Response: We will encrypted the data for leak risk. We will set monitor to block the malicious request(It depend on the request data and Model training). We build on OAuth2 and ECDSA to verify the good request.
+ 
#### 2. Risk
+ If the server is hijacked, fake API will get the above data of the customer, but the signature is encrypted hash and cannot be cracked?
+ Bad: 
#### 3. Risk
+ If the default Guardian is hacked with the private key hash or private key, it is a risk for the one with only one guardian, so it is safer to need at least 2 guardians.
#### 4. Risk
+ Therefore, for customers larger than 10000U, it is recommended to set both Web2+Web3 guardian, preferably 3/5, which is safer.
#### 5. Risk
+ And record the wallet and guardian address on the disconnected mobile phone by yourself, and restore it in mac+chrome environment when it is restored.
#### 6. Risk 
+ In addition, the private key can be recovered once on a regular basis, and the single-day limit+account-moving warning is set, so that the minimum loss is basically controlled, and the private key can be changed in time after being stolen, and the control right can be restored.
#### 7. Risk 
Large account, convenience and security are required. You can purchase officially audited security module+security service.
## Next step
### Tech stack
+ After the MVP delivery, we will build a small community to get the response and advice for SoulWallet, to get more ideas for product detail.
+ We will base on @Mask 's years technical accumulation to develop our product version.
+ Thanks for the Open Source spirit on @Mask and special thanks for @yisi @gaoyuan.

### Team
+ We will recruit new guys (fulltime first) to join us to build the SoulWallet product version.
+ We will build cooperations with other great teams like Astrox, to build AA and SoulWallet together.

### Venture
+ Yeah, we need money, but not so much for a small team.
+ Maybe we will raise a round for product version developing.
+ Contact @zengjiajun @jhfnetboy at twitter.