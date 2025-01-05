import { z } from "zod";
import { CdpAction } from "./cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
/**
 * Input schema for get wallet details action.
 * This schema intentionally accepts no parameters as the wallet is injected separately.
 */
export declare const GetWalletDetailsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
/**
 * Gets a wallet's details.
 *
 * @param wallet - The wallet to get details from.
 * @param _ - The input arguments for the action.
 * @returns A message containing the wallet details.
 */
export declare function getWalletDetails(wallet: Wallet, _: z.infer<typeof GetWalletDetailsInput>): Promise<string>;
/**
 * Get wallet details action.
 */
export declare class GetWalletDetailsAction implements CdpAction<typeof GetWalletDetailsInput> {
    /**
     * The name of the action
     */
    name: string;
    /**
     * A description of what the action does
     */
    description: string;
    /**
     * Schema for validating action arguments
     */
    argsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    /**
     * The function to execute for this action
     */
    func: typeof getWalletDetails;
}
