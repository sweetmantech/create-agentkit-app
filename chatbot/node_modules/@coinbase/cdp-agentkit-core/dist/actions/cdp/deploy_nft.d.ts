import { CdpAction } from "./cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for deploy NFT action.
 */
export declare const DeployNftInput: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    baseURI: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    baseURI: string;
}, {
    symbol: string;
    name: string;
    baseURI: string;
}>;
/**
 * Deploys an NFT (ERC-721) token collection onchain from the wallet.
 *
 * @param wallet - The wallet to deploy the NFT from.
 * @param args - The input arguments for the action.
 * @returns A message containing the NFT token deployment details.
 */
export declare function deployNft(wallet: Wallet, args: z.infer<typeof DeployNftInput>): Promise<string>;
/**
 * Deploy NFT action.
 */
export declare class DeployNftAction implements CdpAction<typeof DeployNftInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        name: z.ZodString;
        symbol: z.ZodString;
        baseURI: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        baseURI: string;
    }, {
        symbol: string;
        name: string;
        baseURI: string;
    }>;
    func: typeof deployNft;
}
