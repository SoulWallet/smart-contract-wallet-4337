/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-02 11:55:34
 */
import Web3 from 'web3';
import { Utils } from './utils/utils';
import fs from 'fs';
import { UserOperation } from './entity/userOperation';
import { Create2Factory, AddressZero } from './defines';
import { signUserOp, getRequestId, getPayMasterSignHash, signPayMasterHash } from './utils/UserOp';
import WalletConnect from "@walletconnect/client";
import { EIP1474_JSONRPC } from './entity/EIP1474_JSONRPC';
import { execFromEntryPoint } from './ABI/execFromEntryPoint';
import * as dotenv from 'dotenv';
dotenv.config();




async function main() {

    // #region init variables

    if (!process.env.USER_PRIVATE_KEY)
        throw new Error('USER_PRIVATE_KEY is not defined');
    if (!process.env.PAYMASTER_PRIVATE_KEY)
        throw new Error('PAYMASTER_PRIVATE_KEY is not defined');
    if (!process.env.PAYMASTER_SIGN_KEY)
        throw new Error('PAYMASTER_SIGN_KEY is not defined');
    if (!process.env.BENEFICIARY_ADDR)
        throw new Error('BENEFICIARY_ADDR is not defined');
    if (!process.env.HTTP_PROVIDER)
        throw new Error('HTTP_PROVIDER is not defined');
    if (!process.env.SPONSER_KEY)
        throw new Error('SPONSER_KEY is not defined');

    /**
     * ETH provider url
     */
    const HTTP_PROVIDER = process.env.HTTP_PROVIDER;

    /**
     * paymaster private key
     */
    const PAYMASTER_PRIVATE_KEY = process.env.PAYMASTER_PRIVATE_KEY;

    /**
     * paymaster sign key
     */
    const PAYMASTER_SIGN_KEY = process.env.PAYMASTER_SIGN_KEY;

    /**
     * beneficiary address
     */
    const BENEFICIARY_ADDR = process.env.BENEFICIARY_ADDR;

    /**
     * user private key
     */
    const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;

    /**
     * SPONSER_KEY
     */
    const SPONSER_KEY = process.env.SPONSER_KEY;


    /**
     * web3 instance
     */
    const web3 = new Web3(HTTP_PROVIDER);

    // get chainId ( use for generate signature、gas price)
    const chainId = await web3.eth.net.getId();
    console.log(`chainId: ${chainId}`);

    // #endregion



    // #region import accounts from private key  

    const account_sponser = web3.eth.accounts.privateKeyToAccount(SPONSER_KEY);
    const balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(account_sponser.address), 'ether'));
    if (balance < 1 /* 1 ETH */) {
        throw new Error('balance is not enough');
    }
    console.log(`account:${account_sponser.address},balance: ${balance} ETH`);

    // #endregion



    // #region singletonFactory

    const singletonFactoryAbi = JSON.parse(fs.readFileSync(`${__dirname}/ABI/SingletonFactory.json`, 'utf8'));
    const singletonFactoryContract = new web3.eth.Contract(singletonFactoryAbi, Create2Factory);

    // #endregion



    // #region EntryPoint
    let entryPointAddress = '0x1EDbE77CB07cE59Ef13E97EF0449D77B9fE5B0dC';

    if (!entryPointAddress) {
        const entryPointObj = await Utils.compileContract(`${__dirname}/contracts/EntryPoint.sol`, 'EntryPoint');
        const entryPointArgs = [
            Create2Factory,                     // address _create2factory
            web3.utils.toWei('0.001', 'ether'), // uint256 _paymasterStake
            60];                                // uint32 _unstakeDelaySec

        const entryPointBytecode = new web3.eth.Contract(entryPointObj.abi).deploy({
            data: '0x' + entryPointObj.bytecode,
            arguments: entryPointArgs
        }).encodeABI();

        const entryPointCreateSalt = 0;

        entryPointAddress = await Utils.create2(
            Create2Factory,       // address _create2factory
            entryPointCreateSalt, // uint256 _create2salt
            entryPointBytecode);  // bytes _initcode

        if (await web3.eth.getCode(entryPointAddress) === '0x') {
            // deploy EntryPoint contract via singletonFactoryContract if not exist 
            console.log(`deploy EntryPoint contract to address:${entryPointAddress}`);
            const deployCallData = singletonFactoryContract.methods.deploy(
                entryPointBytecode,
                Utils.numberToBytes32Hex(entryPointCreateSalt)
            ).encodeABI();

            await Utils.signAndSendTransaction(web3,
                account_sponser.privateKey,
                Create2Factory,
                '0x00',
                deployCallData);
        }
        console.log(`EntryPoint contract address: ${entryPointAddress}`);
    }

    const _entryPointABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/EntryPoint.json`, 'utf8'));
    const entryPointContract = new web3.eth.Contract(_entryPointABI, entryPointAddress);


    // #endregion



    // #region PayMaster

    let payMasterAddress = '0x4276d31f838c59c4e8c18A716b49A04849BdE48F';
    if (!payMasterAddress) {
        // deploy PayMaster contract
        const payMasterObj = await Utils.compileContract(`${__dirname}/contracts/VerifyingPaymaster.sol`, 'VerifyingPaymaster');
        const payMasterArgs = [
            entryPointAddress,                                                  // EntryPoint _entryPoint
            web3.eth.accounts.privateKeyToAccount(PAYMASTER_SIGN_KEY).address   // address _verifyingSigner
        ];

        const payMasterBytecode = new web3.eth.Contract(payMasterObj.abi).deploy({
            data: '0x' + payMasterObj.bytecode,
            arguments: payMasterArgs
        }).encodeABI();

        payMasterAddress = await Utils.signAndSendTransaction(web3,
            PAYMASTER_PRIVATE_KEY,
            undefined,
            '0x00',
            payMasterBytecode) || '0x0';

        console.log(`PayMaster contract address: ${payMasterAddress}`);
    }

    const _payMasterABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/VerifyingPaymaster.json`, 'utf8'));
    const payMasterContract = new web3.eth.Contract(_payMasterABI, payMasterAddress);

    const depositInfo = await entryPointContract.methods.getDepositInfo(payMasterAddress).call();
    if (!depositInfo) {
        throw new Error('depositInfo is null,maybe cannot connect to entryPoint contract');
    }

    if (depositInfo.staked === false ||
        parseFloat(web3.utils.fromWei(depositInfo.stake as string, 'ether')) < 0.05) {
        // deposit 0.1 ETH
        const depositCallData = payMasterContract.methods.deposit().encodeABI();
        await Utils.signAndSendTransaction(web3,
            account_sponser.privateKey,
            payMasterAddress,
            web3.utils.toHex(web3.utils.toWei("0.1", 'ether')),
            depositCallData);

        // add stake to payMaster : addStake(uint32 _unstakeDelaySec)
        const addStakeCallData = payMasterContract.methods.addStake(
            60 * 60 * 24 * 10 // 10 days
        ).encodeABI();
        await Utils.signAndSendTransaction(web3,
            account_sponser.privateKey,
            payMasterAddress,
            web3.utils.toHex(web3.utils.toWei("0.1", 'ether')),
            addStakeCallData);
    }

    // #endregion



    // #region SimpleWallet
    const account_user = web3.eth.accounts.privateKeyToAccount(USER_PRIVATE_KEY);
    const simpleWalletObj = await Utils.compileContract(`${__dirname}/contracts/SimpleWallet.sol`, 'SimpleWallet');
    const simpleWalletArgs = [
        entryPointAddress,                     // EntryPoint anEntryPoint
        account_user.address                   // address anOwner
    ];

    const simpleWalletBytecode = new web3.eth.Contract(simpleWalletObj.abi).deploy({
        data: '0x' + simpleWalletObj.bytecode,
        arguments: simpleWalletArgs
    }).encodeABI();

    const simpleWalletCreateSalt = 0;

    const simpleWalletAddress = await Utils.create2(
        Create2Factory,       // address _create2factory
        simpleWalletCreateSalt, // uint256 _create2salt
        simpleWalletBytecode);  // bytes _initcode

    // get balance of simpleWallet
    let simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(simpleWalletAddress)));
    if (simpleWalletAddressBalance < 0.1) {
        // send some ether to simpleWallet for test
        await Utils.signAndSendTransaction(web3,
            SPONSER_KEY,
            simpleWalletAddress,
            web3.utils.toHex(web3.utils.toWei("0.1", 'ether')),
            undefined);
        simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(simpleWalletAddress)));
        if (simpleWalletAddressBalance < 0.1) {
            throw new Error('simpleWalletAddressBalance is less than 0.0001');
        }
    }

    const gasFee = await Utils.getGasPrice(chainId);

    let userOperation: UserOperation = new UserOperation();

    userOperation.sender = simpleWalletAddress;
    userOperation.maxFeePerGas = gasFee.Max;
    userOperation.maxPriorityFeePerGas = gasFee.MaxPriority;
    userOperation.paymaster = payMasterAddress;

    if (await web3.eth.getCode(simpleWalletAddress) === '0x') {
        userOperation.initCode = simpleWalletBytecode;
        userOperation.nonce = 0;
    } else {
        const _simpleWalletABI = simpleWalletObj.abi;
        const simpleWalletContract = new web3.eth.Contract(_simpleWalletABI, simpleWalletAddress);
        userOperation.nonce = parseInt(await simpleWalletContract.methods.nonce().call(), 10);
    }

    //transfer ether from simpleWallet for test
    userOperation.callData = web3.eth.abi.encodeFunctionCall(
        execFromEntryPoint,
        [
            account_sponser.address,
            web3.utils.toHex(web3.utils.toWei("0.00001", 'ether')), "0x"
        ]
    );
    await userOperation.estimateGas(web3, entryPointAddress);

    const paymasterSignHash = getPayMasterSignHash(userOperation);
    console.log(`paymasterSignHash`, paymasterSignHash);
    userOperation.paymasterData = signPayMasterHash(paymasterSignHash, PAYMASTER_SIGN_KEY)
    console.log(`paymasterData`, userOperation.paymasterData);
    userOperation.signature = signUserOp(userOperation, entryPointAddress, chainId, account_user.privateKey);

    try {
        const result = await entryPointContract.methods.simulateValidation(userOperation).call({
            from: AddressZero
        });
        console.log(`simulateValidation result:`, result);
        if (true) {
            const handleOpsCallData = entryPointContract.methods.handleOps([userOperation], BENEFICIARY_ADDR).encodeABI();
            const AASendTx = await Utils.signAndSendTransaction(web3,
                SPONSER_KEY,
                entryPointAddress,
                '0x00',
                handleOpsCallData);
            console.log(`AASendTx:`, AASendTx);
        }
    } catch (error) {
        console.error(error);
        throw new Error("simulateValidation error");
    }


    // #endregion



    // #region WalletConnect

    // https://app.uniswap.org/#/swap?chain=ropsten
    let uri = '';
    console.log('Please set uri = the QR code URI content of the DAPP walletConnect[like:"wc:xxx..."]');
    debugger;
    if (!uri.startsWith('wc:')) {
        throw new Error('you should use debuger console to set uri!');
    }

    // Create connector
    const connector = new WalletConnect(
        {
            // Required
            uri: uri,
            // Required
            clientMeta: {
                description: "EIP-4337 Wallet Demo",
                url: "https://eips.ethereum.org/EIPS/eip-4337",
                icons: ["https://avatars.githubusercontent.com/u/107106051?s=200&v=4"],
                name: "AA Wallet",
            },
        }
    );

    // Subscribe to session requests
    connector.on("session_request", (error, payload) => {
        if (error) {
            throw error;
        }
        console.log('session_request');
        console.log(payload);
        connector.approveSession({
            chainId: chainId,
            accounts: [
                simpleWalletAddress
            ]
        });

    });

    // Subscribe to call requests
    connector.on("call_request", async (error, payload) => {
        if (error) {
            throw error;
        }
        console.log('call_request');
        console.log(payload);
        const jsonRPC = payload as EIP1474_JSONRPC; if (!jsonRPC) throw new Error('invalid jsonrpc');
        const method = jsonRPC.method; if (!method) throw new Error('invalid method');
        switch (method) {
            case 'wallet_switchEthereumChain':
                //throw new Error("the dApp is not support current chain");
                break;
            case 'eth_sendTransaction':
                const params = jsonRPC.params; if (!params) throw new Error('invalid params');
                const _tx: any = params[0]; if (!_tx) throw new Error('invalid tx');
                //const _gas: string = _tx.gas; if (!_gas) throw new Error('invalid gas');
                const _value: string = _tx.value; if (!_value) throw new Error('invalid value');
                const _from: string = _tx.from; if (!_from) throw new Error('invalid from');
                const _to: string = _tx.to; if (!_to) throw new Error('invalid to');
                const _data: string = _tx.data; if (!_data) throw new Error('invalid data');

                let userOperation: UserOperation = new UserOperation();

                userOperation.sender = web3.utils.toChecksumAddress(_from);
                userOperation.maxFeePerGas = gasFee.Max;
                userOperation.maxPriorityFeePerGas = gasFee.MaxPriority;
                userOperation.paymaster = payMasterAddress;
                const _simpleWalletABI = simpleWalletObj.abi;
                const simpleWalletContract = new web3.eth.Contract(_simpleWalletABI, simpleWalletAddress);
                userOperation.nonce = parseInt(await simpleWalletContract.methods.nonce().call(), 10);


                const transferFromSimpleWalletBytecode = web3.eth.abi.encodeFunctionCall(
                    execFromEntryPoint,
                    [
                        web3.utils.toChecksumAddress(_to),
                        _value,
                        _data
                    ]
                );

                userOperation.callData = transferFromSimpleWalletBytecode;
                await userOperation.estimateGas(web3, entryPointAddress);

                const paymasterSignHash = getPayMasterSignHash(userOperation);
                userOperation.paymasterData = signPayMasterHash(paymasterSignHash, PAYMASTER_SIGN_KEY)
                userOperation.signature = signUserOp(userOperation, entryPointAddress, chainId, account_user.privateKey);
                try {
                    const result = await entryPointContract.methods.simulateValidation(userOperation).call({
                        from: AddressZero
                    });
                    console.log(`simulateValidation result:`, result);
                } catch (error) {
                    console.error(error);
                    throw new Error("simulateValidation error");
                }
                const handleOpsCallData = entryPointContract.methods.handleOps([userOperation], BENEFICIARY_ADDR).encodeABI();
                const AASendTx = await Utils.signAndSendTransaction(web3,
                    SPONSER_KEY,
                    entryPointAddress,
                    '0x00',
                    handleOpsCallData, async (txHash: string) => {
                        // return tx result to DAPP 
                        connector.approveRequest({
                            id: payload.id,
                            result: txHash
                        });
                    });
                console.log(`AASendTx:`, AASendTx);


                break;
            default:
                throw new Error("unknown method:" + method);
        }

    });

    connector.on("disconnect", (error, payload) => {
        if (error) {
            throw error;
        }
        console.log('disconnect');
    });

    // #endregion


}


main(); 