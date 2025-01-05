/**
 * This module provides functionality to post a tweet on Twitter (X).
 */
import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";
/**
 * Input argument schema for the post tweet action.
 */
export declare const PostTweetInput: z.ZodObject<{
    tweet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tweet: string;
}, {
    tweet: string;
}>;
/**
 * Posts a tweet on Twitter (X).
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param args - The input arguments for the action.
 * @returns A message indicating the success or failure of the tweet posting.
 */
export declare function postTweet(client: TwitterApi, args: z.infer<typeof PostTweetInput>): Promise<string>;
/**
 * Post Tweet Action
 */
export declare class PostTweetAction implements TwitterAction<typeof PostTweetInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        tweet: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tweet: string;
    }, {
        tweet: string;
    }>;
    func: typeof postTweet;
}
