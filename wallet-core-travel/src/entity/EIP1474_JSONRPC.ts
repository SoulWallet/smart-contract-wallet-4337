/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-31 22:02:53
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-31 22:08:05
 */
export interface EIP1474_JSONRPC {
    id: number;
    jsonrpc: string;
    method: string;
    params: unknown[];
}