import { z } from "zod";
import { TwitterAction, TwitterActionSchemaAny } from "./actions/cdp/social/twitter";
/**
 * Schema for the options required to initialize the TwitterAgentkit.
 */
export declare const TwitterAgentkitOptions: z.ZodObject<{
    apiKey: z.ZodString;
    apiSecret: z.ZodString;
    accessToken: z.ZodString;
    accessTokenSecret: z.ZodString;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
}, {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
}>;
/**
 * Twitter Agentkit
 */
export declare class TwitterAgentkit {
    private client;
    /**
     * Initializes a new instance of TwitterAgentkit with the provided options.
     * If no options are provided, it attempts to load the required environment variables.
     *
     * @param options - Optional. The configuration options for the TwitterAgentkit.
     * @throws An error if the provided options are invalid or if the environment variables cannot be loaded.
     */
    constructor(options?: z.infer<typeof TwitterAgentkitOptions>);
    /**
     * Validates the provided options for the TwitterAgentkit.
     *
     * @param options - The options to validate.
     * @returns True if the options are valid, otherwise false.
     */
    validateOptions(options: z.infer<typeof TwitterAgentkitOptions>): boolean;
    /**
     * Executes a Twitter (X) action.
     *
     * @param action - The Twitter (X) action to execute.
     * @param args - The arguments for the action.
     * @returns The result of the execution.
     */
    run<TActionSchema extends TwitterActionSchemaAny>(action: TwitterAction<TActionSchema>, args: TActionSchema): Promise<string>;
}
