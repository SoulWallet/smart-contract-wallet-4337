/*
 * @Description: utils
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-31 23:30:36
 */

import { getCreate2Address, hexlify, hexZeroPad, keccak256 } from 'ethers/lib/utils';
const solc = require('solc');
import fs from 'fs';
import { SuggestedGasFees } from '../entity/suggestedGasFees';
import Web3 from 'web3';
import got from 'got';

export class Utils {


    /**
     * sleep ms
     * @param {number} time ms
     */
    static sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        })
    }

    static numberToBytes32Hex(number: number): string {
        return hexZeroPad(hexlify(number), 32);
    }

    /**
     * generate create2 address
     * @param from contract address
     * @param salt salt number
     * @param initCode contract bytecode hex string
     * @returns contract address
     */
    static create2(from: string, salt: number, initCode: string): string {
        const saltBytes32 = Utils.numberToBytes32Hex(salt);
        const initCodeHash = keccak256(initCode);
        return getCreate2Address(from, saltBytes32, initCodeHash);
    }




    /**
     * compile *.sol file
     * @param solPath *.sol file path
     * @param contractClassName contract class name
     * @returns 
     */
    static async compileContract(solPath: string, contractClassName: string) {
        const input = {
            language: 'Solidity',
            sources: {
                'contract.sol': {
                    content: fs.readFileSync(solPath, 'utf8')
                }
            },
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: 'london',
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };
        console.log(`solc version:${solc.version()}`);

        // enable optimizer 200  
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        const abi = output.contracts['contract.sol'][contractClassName].abi;
        const bytecode: string = output.contracts['contract.sol'][contractClassName].evm.bytecode.object;

        return {
            abi, bytecode
        }
    }


    /**
     * get suggested gas fees use codefi network api
     * @param chainid chain id
     * @returns SuggestedGasFees
     */
    private static async getSuggestedGasFees(chainid: number): Promise<SuggestedGasFees | null> {
        try {
            const json = await got.get(`https://gas-api.metaswap.codefi.network/networks/${chainid}/suggestedGasFees`).json() as SuggestedGasFees;
            if (json && json.high && json.medium) {
                return json;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * get suggested gas fees from codefi network
     * @param chainid chain id
     * @param type gas level
     * @returns suggested gas fees
     */
    static async getGasPrice(chainid: number, type: 'low' | 'medium' | 'high' = 'high') {
        let suggestedGasFees = await Utils.getSuggestedGasFees(chainid);
        if (suggestedGasFees) {
            let f = suggestedGasFees[type];
            if (f && f.suggestedMaxPriorityFeePerGas && f.suggestedMaxFeePerGas && suggestedGasFees.estimatedBaseFee) {
                const MaxPriority = Math.ceil(parseFloat(f.suggestedMaxPriorityFeePerGas)).toString();
                const Max = Math.ceil(parseFloat(f.suggestedMaxFeePerGas)).toString();
                const Base = Math.ceil(parseFloat(suggestedGasFees.estimatedBaseFee)).toString();
                console.log(`Base:${Base} \t Max:${Max} \t MaxPriority:${MaxPriority}`);
                const web3 = new Web3();
                return {
                    Base: web3.utils.toWei(Base, 'gwei'),
                    Max: web3.utils.toWei(Max, 'gwei'),
                    MaxPriority: web3.utils.toWei(MaxPriority, 'gwei')
                }
            }
        }
        throw new Error('get GasPrice error');

    }

    /**
     * sign transaction and send transaction
     * @param web3 web3 instance
     * @param privateKey private key of from account
     * @param to to address
     * @param value value
     * @param data data
     * @returns null or transaction hash
     */
    static async signAndSendTransaction(web3: Web3,
        privateKey: string,
        to: string | undefined,
        value: string,
        data: string | undefined, callback?: (txhash: string) => void) {
        const chainId = await web3.eth.net.getId();
        const gasPrice = await Utils.getGasPrice(chainId);
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const rawTx = {
            from: account.address,
            to: to,
            value: value,
            data: data,
            gas: web3.utils.toWei('1', 'ether'),
            maxPriorityFeePerGas: gasPrice.MaxPriority,
            maxFeePerGas: gasPrice.Max
        };

        let gas = (await web3.eth.estimateGas(rawTx)) * 10;
        rawTx.gas = web3.utils.toHex(web3.utils.toBN(gas)); // gas limit
        let signedTransactionData = await account.signTransaction(rawTx);
        if (signedTransactionData.rawTransaction && signedTransactionData.transactionHash) {
            callback && callback(signedTransactionData.transactionHash);
            await web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction, (err: any, hash: string) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`tx:${hash} has been sent, please wait few secs to confirm`);

                }
            });
            while (true) {
                await Utils.sleep(1000 * 1);
                const receipt = await web3.eth.getTransactionReceipt(signedTransactionData.transactionHash);
                if (receipt) {
                    if (receipt.status === true) {
                        if (to) {
                            return signedTransactionData.transactionHash;
                        } else {
                            return receipt.logs[0].address;
                        }

                    } else {
                        throw new Error('transaction failed');
                    }
                }
            }
        }
        return null;
    }

}

