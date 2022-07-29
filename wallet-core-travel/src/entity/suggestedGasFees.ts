/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-06-22 16:15:42
 * @LastEditors: cejay
 * @LastEditTime: 2022-07-28 11:57:01
 */

export class fee {
    suggestedMaxPriorityFeePerGas?: string;
    suggestedMaxFeePerGas?: string;
    minWaitTimeEstimate?: number;
    maxWaitTimeEstimate?: number;
}


export class SuggestedGasFees {
    low?: fee;
    medium?: fee;
    high?: fee;
    estimatedBaseFee?: string;
    networkCongestion?: number;
    latestPriorityFeeRange?: string[];
    historicalPriorityFeeRange?: string[];
    historicalBaseFeeRange?: string[];
    priorityFeeTrend?: string;
    baseFeeTrend?: string;
}

