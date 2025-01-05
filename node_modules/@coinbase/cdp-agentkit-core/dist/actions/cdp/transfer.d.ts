import { CdpAction } from "./cdp_action";
import { Wallet, Amount } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for transfer action.
 */
export declare const TransferInput: z.ZodObject<{
    amount: z.ZodType<Amount, z.ZodTypeDef, Amount>;
    assetId: z.ZodString;
    destination: z.ZodString;
    gasless: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    assetId: string;
    destination: string;
    amount: Amount;
    gasless: boolean;
}, {
    assetId: string;
    destination: string;
    amount: Amount;
    gasless?: boolean | undefined;
}>;
/**
 * Transfers a specified amount of an asset to a destination onchain.
 *
 * @param wallet - The wallet to transfer the asset from.
 * @param args - The input arguments for the action.
 * @returns A message containing the transfer details.
 */
export declare function transfer(wallet: Wallet, args: z.infer<typeof TransferInput>): Promise<string>;
/**
 * Transfer action.
 */
export declare class TransferAction implements CdpAction<typeof TransferInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        amount: z.ZodType<Amount, z.ZodTypeDef, Amount>;
        assetId: z.ZodString;
        destination: z.ZodString;
        gasless: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        assetId: string;
        destination: string;
        amount: Amount;
        gasless: boolean;
    }, {
        assetId: string;
        destination: string;
        amount: Amount;
        gasless?: boolean | undefined;
    }>;
    func: typeof transfer;
}
