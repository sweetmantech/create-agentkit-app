import { CdpAction } from "../../../cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for sell token action.
 */
export declare const WowSellTokenInput: z.ZodObject<{
    contractAddress: z.ZodString;
    amountTokensInWei: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    amountTokensInWei: string;
}, {
    contractAddress: string;
    amountTokensInWei: string;
}>;
/**
 * Sells WOW tokens for ETH.
 *
 * @param wallet - The wallet to sell the tokens from.
 * @param args - The input arguments for the action.
 * @returns A message confirming the sale with the transaction hash.
 */
export declare function wowSellToken(wallet: Wallet, args: z.infer<typeof WowSellTokenInput>): Promise<string>;
/**
 * Zora Wow sell token action.
 */
export declare class WowSellTokenAction implements CdpAction<typeof WowSellTokenInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        contractAddress: z.ZodString;
        amountTokensInWei: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        contractAddress: string;
        amountTokensInWei: string;
    }, {
        contractAddress: string;
        amountTokensInWei: string;
    }>;
    func: typeof wowSellToken;
}
