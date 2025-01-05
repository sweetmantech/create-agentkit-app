import { CdpAction } from "../../../cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for buy token action.
 */
export declare const WowBuyTokenInput: z.ZodObject<{
    contractAddress: z.ZodString;
    amountEthInWei: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    amountEthInWei: string;
}, {
    contractAddress: string;
    amountEthInWei: string;
}>;
/**
 * Buys a Zora Wow ERC20 memecoin with ETH.
 *
 * @param wallet - The wallet to create the token from.
 * @param args - The input arguments for the action.
 * @returns A message containing the token purchase details.
 */
export declare function wowBuyToken(wallet: Wallet, args: z.infer<typeof WowBuyTokenInput>): Promise<string>;
/**
 * Zora Wow buy token action.
 */
export declare class WowBuyTokenAction implements CdpAction<typeof WowBuyTokenInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        contractAddress: z.ZodString;
        amountEthInWei: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        contractAddress: string;
        amountEthInWei: string;
    }, {
        contractAddress: string;
        amountEthInWei: string;
    }>;
    func: typeof wowBuyToken;
}
