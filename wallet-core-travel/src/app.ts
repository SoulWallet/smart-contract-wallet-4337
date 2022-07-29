/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-29 11:39:28
 */
import Web3 from 'web3';
import { Utils } from './utils/utils';
import fs from 'fs';
import { UserOperation } from './entity/userOperation';
import { Create2Factory, AddressZero } from './defines';
import { signUserOp, getRequestId, getPayMasterSignHash, signPayMasterHash } from './utils/UserOp';
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
    if (simpleWalletAddressBalance < 0.0001) {
        // send some ether to simpleWallet for test
        await Utils.signAndSendTransaction(web3,
            SPONSER_KEY,
            simpleWalletAddress,
            web3.utils.toHex(web3.utils.toWei("0.0001", 'ether')),
            undefined);
        simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(simpleWalletAddress)));
        if (simpleWalletAddressBalance < 0.0001) {
            throw new Error('simpleWalletAddressBalance is less than 0.0001');
        }
    }


    let userOperation: UserOperation = new UserOperation();

    userOperation.sender = simpleWalletAddress;
    userOperation.callGas = 3e6;
    userOperation.verificationGas = 2e6;
    userOperation.preVerificationGas = 1e6;
    userOperation.maxFeePerGas = 10e9;
    userOperation.maxPriorityFeePerGas = 10e9;
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

    const transferFromSimpleWalletBytecode = web3.eth.abi.encodeFunctionCall({
        "inputs": [
            {
                "internalType": "address",
                "name": "dest",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "func",
                "type": "bytes"
            }
        ],
        "name": "execFromEntryPoint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, [account_sponser.address, web3.utils.toHex(web3.utils.toWei("0.0001", 'ether')), "0x"]);

    userOperation.callData = transferFromSimpleWalletBytecode;


    // #region    paymaster sign request start
    const paymasterSignHash = getPayMasterSignHash(userOperation);
    console.log(`paymasterSignHash`, paymasterSignHash);
    userOperation.paymasterData = signPayMasterHash(paymasterSignHash, PAYMASTER_SIGN_KEY)
    console.log(`paymasterData`, userOperation.paymasterData);
    // #endregion paymaster sign request end 


    // #region    user sign start
    userOperation.signature = signUserOp(userOperation, entryPointAddress, chainId, account_user.privateKey);
    // #endregion user sign end

    const requestId = getRequestId(userOperation, entryPointAddress, chainId);//keccak256(abi.encode(userOp.hash(), address(this), block.chainid));

    // userOperation2tuple
    // const userOperation2tuple = `["${userOperation.sender}",${userOperation.nonce},"${userOperation.initCode}","${userOperation.callData}",${userOperation.callGas},${userOperation.verificationGas},${userOperation.preVerificationGas},${userOperation.maxFeePerGas},${userOperation.maxPriorityFeePerGas},"${userOperation.paymaster}","${userOperation.paymasterData}","${userOperation.signature}"]`;

    // #region   paymaster send request start
    try {
        const result = await entryPointContract.methods.simulateValidation(userOperation).call({
            from: AddressZero
        });
        console.log(`simulateValidation result:`, result);
    } catch (error) {
        console.error(error);
        throw new Error("simulateValidation error");
    }
    // #endregion paymaster send request end
    const handleOpsCallData = entryPointContract.methods.handleOps([userOperation], BENEFICIARY_ADDR).encodeABI();
    await Utils.signAndSendTransaction(web3,
        SPONSER_KEY,
        entryPointAddress,
        '0x00',
        handleOpsCallData);
    console.log(`handleOpsCallData:`, handleOpsCallData);



    // #endregion





}


main(); 