/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-27 19:48:09
 */
import Web3 from 'web3';
import { Utils } from './utils/utils';
import fs from 'fs';
import { UserOperation } from './entity/userOperation';
import { EntryPointAddress, Create2Factory, AddressZero, PayMasterAddress } from './defines';
import { signUserOp, getRequestId, getPayMasterSignHash, signPayMasterHash } from './utils/UserOp';
const Tx = require('ethereumjs-tx')
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {

    /**
     * web3 instance
     */
    const web3 = new Web3('https://rinkeby.infura.io/v3/21d2f7b2f3cd4afca4c6d1930ec801c4');

    // get chainId ( use for generate signature)
    const chainId = await web3.eth.net.getId();
    console.log(`chainId: ${chainId}`);

    /**
     * contract bytecode.contract template (test code)
     */
    const bytecodeTemplate = fs.readFileSync('./src/bytecodes/simpleWallet.txt', 'utf8');

    // generate control key for EIP-4337 contract
    const _account = web3.eth.accounts.create('paymaster_test_10');
    const address = _account.address;
    const privateKey = _account.privateKey;
    console.log(`Address: ${address}, PrivateKey: ${privateKey}`);


    // generate contract wallet address
    // create bytecode with constructor params(entry point address, control key[address])
    const initCode = `${bytecodeTemplate}000000000000000000000000${EntryPointAddress.substring(2).toLowerCase()}000000000000000000000000${address.substring(2).toLowerCase()}`;
    const salt = 0;
    const walletAddress = Utils.create2(Create2Factory, salt, initCode);
    console.log(`Contract wallet address: ${walletAddress}`);

    /**
     * deploy EIP-4337 contract wallet
     * 1. generate UserOperation
     * 2. entrypoint::simulateValidation(UserOperation)
     */

    // 1. generate UserOperation
    let userOperation: UserOperation = new UserOperation();
    {
        userOperation.sender = walletAddress;
        userOperation.nonce = 0;
        userOperation.initCode = initCode;
        //userOperation.callData = '0x';
        userOperation.callGas = 3e6;
        userOperation.verificationGas = 2e6;
        userOperation.preVerificationGas = 1e6;
        userOperation.maxFeePerGas = 10e9;
        userOperation.maxPriorityFeePerGas = 10e9;
        userOperation.paymaster = PayMasterAddress; // paymaster is not used in this example
    }
    const requestId = getRequestId(userOperation, chainId);//keccak256(abi.encode(userOp.hash(), address(this), block.chainid));


    const paymasterSignHash = getPayMasterSignHash(userOperation)
    console.log(`paymasterSignHash `, paymasterSignHash)
    userOperation.paymasterData = signPayMasterHash(paymasterSignHash, process.env.PAYMASTER_SIGN_KEY as string)
    console.log(`paymasterData `, userOperation.paymasterData)

    userOperation.signature = signUserOp(userOperation, privateKey, chainId);
    console.log(`userOperation `, userOperation)


    // 2. entrypoint::simulateValidation(UserOperation)
    // read entrypoint ABI from file
    const entrypointAbi = JSON.parse(fs.readFileSync('./src/ABI/entry_point.json', 'utf8'));
    // get entrypoint contract instance
    const entrypointContract = new web3.eth.Contract(entrypointAbi, process.env.BENEFICIARY_ADDR);
    // call entrypoint::simulateValidation(UserOperation)
    // function simulateValidation(UserOperation calldata userOp) external returns (uint256 preOpGas, uint256 prefund)
    // try {
    //     const result = await entrypointContract.methods.simulateValidation(userOperation).call();
    //     console.log(`simulateValidation result: ${result}`);

    // } catch (error) {
    //     console.log(error);
    // }

    console.log(`userOperation `, userOperation)


    const rawTx = {
        nonce: 10,
        chainId: chainId,
        gasPrice: web3.utils.numberToHex(web3.utils.toWei("8", 'gwei')),
        gasLimit: 3000000,
        to: EntryPointAddress,
        data: entrypointContract.methods.handleOps([userOperation], process.env.BENEFICIARY_ADDR).encodeABI()
    }
    let tx = new Tx(rawTx)
    let priv = Buffer.from((process.env.SPONSER_KEY?.substring(2)) as string, 'hex')
    tx.sign(priv)
    let serializedTx = tx.serialize()
    return new Promise(function (resolve, reject) {
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')) // Broadcast the transaction to the network
            .once('transactionHash', console.log)
            .once('receipt', function (receipt) {
                resolve(receipt)
            })
            .on('error', function (err) {
                console.log(`error : ${err}`)
                reject(err)
            })
    })






}


main(); 