import { CdpAction } from "./cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for get balance action.
 */
export declare const GetBalanceInput: z.ZodObject<{
    assetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assetId: string;
}, {
    assetId: string;
}>;
/**
 * Gets balance for all addresses in the wallet for a given asset.
 *
 * @param wallet - The wallet to get the balance for.
 * @param args - The input arguments for the action.
 * @returns A message containing the balance information.
 */
export declare function getBalance(wallet: Wallet, args: z.infer<typeof GetBalanceInput>): Promise<string>;
/**
 * Get wallet balance action.
 */
export declare class GetBalanceAction implements CdpAction<typeof GetBalanceInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        assetId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        assetId: string;
    }, {
        assetId: string;
    }>;
    func: typeof getBalance;
}
