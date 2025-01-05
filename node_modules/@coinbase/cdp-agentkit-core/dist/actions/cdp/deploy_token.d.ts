import { CdpAction } from "./cdp_action";
import { Wallet, Amount } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for deploy token action.
 */
export declare const DeployTokenInput: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    totalSupply: z.ZodType<Amount, z.ZodTypeDef, Amount>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    totalSupply: Amount;
}, {
    symbol: string;
    name: string;
    totalSupply: Amount;
}>;
/**
 * Deploys an ERC20 token smart contract.
 *
 * @param wallet - The wallet to deploy the Token from.
 * @param args - The input arguments for the action.
 * @returns A message containing the deployed token contract address and details.
 */
export declare function deployToken(wallet: Wallet, args: z.infer<typeof DeployTokenInput>): Promise<string>;
/**
 * Deploy token action.
 */
export declare class DeployTokenAction implements CdpAction<typeof DeployTokenInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        name: z.ZodString;
        symbol: z.ZodString;
        totalSupply: z.ZodType<Amount, z.ZodTypeDef, Amount>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        totalSupply: Amount;
    }, {
        symbol: string;
        name: string;
        totalSupply: Amount;
    }>;
    func: typeof deployToken;
}
