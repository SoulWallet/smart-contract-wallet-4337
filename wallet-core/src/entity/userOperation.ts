/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-25 10:53:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-25 11:37:18
 */

import { AbiCoder } from "ethers/lib/utils";

/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol    
 */
class UserOperation {
    /**
     * @param sender the sender account of this request
     */
    sender: string = '';
    /**
     * @param nonce unique value the sender uses to verify it is not a replay.
     */
    nonce: number = 0;
    /**
     * @param initCode if set, the account contract will be created by this constructor
     */
    initCode: string = '0x';
    /**
     * @param callData the method call to execute on this account.
     */
    callData: string = '0x';
    /**
     * @param callGas gas used for validateUserOp and validatePaymasterUserOp
     */
    callGas: number = 0;
    /**
     * @param verificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    verificationGas: number = 0;
    /**
     * @param preVerificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    preVerificationGas: number = 0;
    /**
     * @param maxFeePerGas same as EIP-1559 gas parameter
     */
    maxFeePerGas: number = 0;
    /**
     * @param maxPriorityFeePerGas same as EIP-1559 gas parameter
     */
    maxPriorityFeePerGas: number = 0;
    /**
     * @param paymaster if set, the paymaster will pay for the transaction instead of the sender
     */
    paymaster: string = '0x';
    /**
     * @param paymasterData extra data used by the paymaster for validation
     */
    paymasterData: string = '0x';
    /**
     * @param signature sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    signature: string = '0x';

    hash() {
        /*
        keccak256(abi.encode(
                        userOp.getSender(),
                        userOp.nonce,
                        keccak256(userOp.initCode),
                        keccak256(userOp.callData),
                        userOp.callGas,
                        userOp.verificationGas,
                        userOp.preVerificationGas,
                        userOp.maxFeePerGas,
                        userOp.maxPriorityFeePerGas,
                        userOp.paymaster
                    ));
         */
        const abi = new AbiCoder();
        // #todo
    }
}



export { UserOperation };