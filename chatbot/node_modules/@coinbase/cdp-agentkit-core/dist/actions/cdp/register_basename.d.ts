import { CdpAction } from "./cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
export declare const BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET = "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5";
export declare const BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET = "0x49aE3cC2e3AA768B1e5654f5D3C6002144A59581";
export declare const L2_RESOLVER_ADDRESS_MAINNET = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";
export declare const L2_RESOLVER_ADDRESS_TESTNET = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";
export declare const REGISTRATION_DURATION = "31557600";
export declare const L2_RESOLVER_ABI: {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: never[];
    stateMutability: string;
    type: string;
}[];
export declare const REGISTRAR_ABI: {
    inputs: {
        components: {
            internalType: string;
            name: string;
            type: string;
        }[];
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: never[];
    stateMutability: string;
    type: string;
}[];
/**
 * Input schema for registering a Basename.
 */
export declare const RegisterBasenameInput: z.ZodObject<{
    basename: z.ZodString;
    amount: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    basename: string;
    amount: string;
}, {
    basename: string;
    amount?: string | undefined;
}>;
/**
 * Registers a Basename for the agent.
 *
 * @param wallet - The wallet to register the Basename with.
 * @param args - The input arguments for the action.
 * @returns Confirmation message with the basename.
 */
export declare function registerBasename(wallet: Wallet, args: z.infer<typeof RegisterBasenameInput>): Promise<string>;
/**
 * Register Basename action.
 */
export declare class RegisterBasenameAction implements CdpAction<typeof RegisterBasenameInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        basename: z.ZodString;
        amount: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        basename: string;
        amount: string;
    }, {
        basename: string;
        amount?: string | undefined;
    }>;
    func: typeof registerBasename;
}
