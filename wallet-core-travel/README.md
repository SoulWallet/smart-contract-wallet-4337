EIP-4337 Contract Wallet, CLI Code

```bash
cp .env.bak .env
npm run start
```

当前进度：

1. EIP-4337合约钱包
   - ✅	基础钱包(来自eth-infinitism)
   - ☑️	EIP-1271支持
   - ☑️	社交恢复支持
   - ☑️	可升级合约支持

2. PayMaster
   - ✅	基础paymaster(补贴gas fee)
   - ☑️	连接兑换协议的PayMaster(例如uniswap)

3. EIP-4337命令行交互 [source code](https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/app.ts)
   - ✅	创建钱包
   - ✅	从钱包执行交易
   - ☑️	社交恢复


