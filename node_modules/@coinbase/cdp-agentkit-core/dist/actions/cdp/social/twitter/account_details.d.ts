/**
 * This module provides functionality to retrieve account details for the currently authenticated Twitter (X) user.
 */
import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";
/**
 * Input argument schema for the account details action.
 */
export declare const AccountDetailsInput: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
/**
 * Get the authenticated Twitter (X) user account details.
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param _ - The input arguments for the action.
 * @returns A message containing account details for the authenticated user context.
 */
export declare function accountDetails(client: TwitterApi, _: z.infer<typeof AccountDetailsInput>): Promise<string>;
/**
 * Account Details Action
 */
export declare class AccountDetailsAction implements TwitterAction<typeof AccountDetailsInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    func: typeof accountDetails;
}
