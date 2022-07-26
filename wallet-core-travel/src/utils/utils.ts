/*
 * @Description: utils
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-25 11:33:02
 */

import { getCreate2Address, hexlify, hexZeroPad, keccak256 } from 'ethers/lib/utils';

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

    /**
     * generate create2 address
     * @param from contract address
     * @param salt salt number
     * @param initCode contract bytecode hex string
     * @returns contract address
     */
    static create2(from: string, salt: number, initCode: string): string {
        const saltBytes32 = hexZeroPad(hexlify(salt), 32);
        const initCodeHash = keccak256(initCode);
        return getCreate2Address(from, saltBytes32, initCodeHash);
    }



}