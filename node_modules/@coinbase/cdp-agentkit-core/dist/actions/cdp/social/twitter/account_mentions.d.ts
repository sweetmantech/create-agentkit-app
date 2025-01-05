/**
 * This module provides functionality to retrieve account mentions from Twitter (X).
 */
import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";
/**
 * Input argument schema for the account mentions action.
 */
export declare const AccountMentionsInput: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
/**
 * Retrieves mentions for a specified Twitter (X) user.
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param args - The input arguments for the action.
 * @returns A message indicating the success or failure of the mention retrieval.
 */
export declare function accountMentions(client: TwitterApi, args: z.infer<typeof AccountMentionsInput>): Promise<string>;
/**
 * Account Mentions Action
 */
export declare class AccountMentionsAction implements TwitterAction<typeof AccountMentionsInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
    }, {
        userId: string;
    }>;
    func: typeof accountMentions;
}
