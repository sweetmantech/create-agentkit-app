import { CdpAction } from "./cdp_action";
import { Wallet, Amount } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for trade action.
 */
export declare const TradeInput: z.ZodObject<{
    amount: z.ZodType<Amount, z.ZodTypeDef, Amount>;
    fromAssetId: z.ZodString;
    toAssetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: Amount;
    fromAssetId: string;
    toAssetId: string;
}, {
    amount: Amount;
    fromAssetId: string;
    toAssetId: string;
}>;
/**
 * Trades a specified amount of a from asset to a to asset for the wallet.
 *
 * @param wallet - The wallet to trade the asset from.
 * @param args - The input arguments for the action.
 * @returns A message containing the trade details.
 */
export declare function trade(wallet: Wallet, args: z.infer<typeof TradeInput>): Promise<string>;
/**
 * Trade action.
 */
export declare class TradeAction implements CdpAction<typeof TradeInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        amount: z.ZodType<Amount, z.ZodTypeDef, Amount>;
        fromAssetId: z.ZodString;
        toAssetId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: Amount;
        fromAssetId: string;
        toAssetId: string;
    }, {
        amount: Amount;
        fromAssetId: string;
        toAssetId: string;
    }>;
    func: typeof trade;
}
