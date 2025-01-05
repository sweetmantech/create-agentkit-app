import { CdpAction } from "../../../cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for create token action.
 */
export declare const WowCreateTokenInput: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    tokenUri: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    tokenUri?: string | undefined;
}, {
    symbol: string;
    name: string;
    tokenUri?: string | undefined;
}>;
/**
 * Creates a Zora Wow ERC20 memecoin.
 *
 * @param wallet - The wallet to create the token from.
 * @param args - The input arguments for the action.
 * @returns A message containing the token creation details.
 */
export declare function wowCreateToken(wallet: Wallet, args: z.infer<typeof WowCreateTokenInput>): Promise<string>;
/**
 * Zora Wow create token action.
 */
export declare class WowCreateTokenAction implements CdpAction<typeof WowCreateTokenInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        name: z.ZodString;
        symbol: z.ZodString;
        tokenUri: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        tokenUri?: string | undefined;
    }, {
        symbol: string;
        name: string;
        tokenUri?: string | undefined;
    }>;
    func: typeof wowCreateToken;
}
