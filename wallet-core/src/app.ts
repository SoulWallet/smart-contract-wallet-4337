/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-25 11:32:20
 */
import Web3 from 'web3';
import { Utils } from './utils/utils';
import fs from 'fs';
import { UserOperation } from './entity/userOperation';

async function main() {

    /**
     * web3 instance
     */
    const web3 = new Web3('https://ropsten.infura.io/v3/21d2f7b2f3cd4afca4c6d1930ec801c4');
    // get chainId ( use for generate signature)
    const chainId = await web3.eth.net.getId();
    console.log(`chainId: ${chainId}`);

    /**
     * entry point contract address. singleton contract.(test address)
     */
    const entryPointAddress = '0xeC97dc3Ef34b876caA9CC3E7EF91DE0D66cd689F';
    /**
     * create2factory address defined in eip-2470.
     */
    const create2factory = '0xce0042B868300000d44A59004Da54A005ffdcf9f';
    /**
     * contract bytecode.contract template (test code)
     */
    const bytecodeTemplate = fs.readFileSync('./src/bytecodes/simpleWallet.txt', 'utf8');

    // generate control key for EIP-4337 contract
    const _account = web3.eth.accounts.create();
    const address = _account.address;
    const privateKey = _account.privateKey;
    console.log(`Address: ${address}, PrivateKey: ${privateKey}`);

    // generate contract wallet address
    // create bytecode with constructor params(entry point address, control key[address])
    const initCode = `${bytecodeTemplate}000000000000000000000000${entryPointAddress.substring(2).toLowerCase()}000000000000000000000000${address.substring(2).toLowerCase()}`;
    const salt = 0;
    const walletAddress = Utils.create2(create2factory, salt, initCode);
    console.log(`Contract wallet address: ${walletAddress}`);

    /**
     * deploy EIP-4337 contract wallet
     * 1. generate UserOperation
     * 2. entrypoint::simulateValidation(UserOperation)
     */

    // 1. generate UserOperation
    const userOperation: UserOperation = new UserOperation();
    {
        userOperation.sender = walletAddress;
        userOperation.nonce = 0;
        userOperation.initCode = initCode;
        //userOperation.callData = '0x';
        userOperation.callGas = 0;
        userOperation.verificationGas = 0;
        userOperation.preVerificationGas = 0;
        userOperation.maxFeePerGas = 0;
        userOperation.maxPriorityFeePerGas = 0;
        userOperation.paymaster = '0x0000000000000000000000000000000000000000'; // paymaster is not used in this example
        //userOperation.paymasterData = '0x';
        const requestId = '';//keccak256(abi.encode(userOp.hash(), address(this), block.chainid));
        userOperation.signature = web3.eth.accounts.sign(requestId, privateKey).signature;
    }
















}


main(); 