EIP-4337 Contract Wallet, CLI Code

```bash
cp .env.bak .env
npm run start
```

Development Prograss：

1. EIP-4337 smart contract wallet
   - ✅	Basic wallet function (via eth-infinitism)
   - ☑️	Supoport EIP-1271
   - ☑️	Support social recovery
   - ☑️	support contract upgrade

2. PayMaster
   - ✅	allow protocols to pay for the gas fee
   - ☑️	Connect AMM to allow user pay in ERC-20 (like uniswap)

3. EIP-4337 CLI [source code](https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/app.ts)
   - ✅	Create wallet
   - ✅	Initiate transaction
   - ☑️	Social recovery


