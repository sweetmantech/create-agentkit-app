import { CdpAction } from "./cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
/**
 * Input schema for mint NFT action.
 */
export declare const MintNftInput: z.ZodObject<{
    contractAddress: z.ZodString;
    destination: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    destination: string;
}, {
    contractAddress: string;
    destination: string;
}>;
/**
 * Mints an NFT (ERC-721) to a specified destination address onchain.
 *
 * @param wallet - The wallet to mint the NFT from.
 * @param args - The input arguments for the action.
 * @returns A message containing the NFT mint details.
 */
export declare function mintNft(wallet: Wallet, args: z.infer<typeof MintNftInput>): Promise<string>;
/**
 * Mint NFT action.
 */
export declare class MintNftAction implements CdpAction<typeof MintNftInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        contractAddress: z.ZodString;
        destination: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        contractAddress: string;
        destination: string;
    }, {
        contractAddress: string;
        destination: string;
    }>;
    func: typeof mintNft;
}
