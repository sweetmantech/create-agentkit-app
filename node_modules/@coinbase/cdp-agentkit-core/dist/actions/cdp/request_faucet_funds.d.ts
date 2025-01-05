import { CdpAction } from "./cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for request faucet funds action.
 */
export declare const RequestFaucetFundsInput: z.ZodObject<{
    assetId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assetId?: string | undefined;
}, {
    assetId?: string | undefined;
}>;
/**
 * Requests test tokens from the faucet for the default address in the wallet.
 *
 * @param wallet - The wallet to receive tokens.
 * @param args - The input arguments for the action.
 * @returns A confirmation message with transaction details.
 */
export declare function requestFaucetFunds(wallet: Wallet, args: z.infer<typeof RequestFaucetFundsInput>): Promise<string>;
/**
 * Request faucet funds action.
 */
export declare class RequestFaucetFundsAction implements CdpAction<typeof RequestFaucetFundsInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        assetId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        assetId?: string | undefined;
    }, {
        assetId?: string | undefined;
    }>;
    func: typeof requestFaucetFunds;
}
