/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-01 23:48:24
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-01 23:53:46
 */

import { AbiItem } from 'web3-utils';
const execFromEntryPoint: AbiItem = {
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
};
export { execFromEntryPoint };