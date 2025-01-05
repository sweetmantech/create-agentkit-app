/**
 * This module provides functionality to post a reply to a tweet on Twitter (X).
 */
import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";
/**
 * Input argument schema for the post tweet reply action.
 */
export declare const PostTweetReplyInput: z.ZodObject<{
    tweetId: z.ZodString;
    tweetReply: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tweetId: string;
    tweetReply: string;
}, {
    tweetId: string;
    tweetReply: string;
}>;
/**
 * Posts a reply to a specified tweet on Twitter (X).
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param args - The input arguments for the action.
 * @returns A message indicating the success or failure of the reply posting.
 */
export declare function postTweet(client: TwitterApi, args: z.infer<typeof PostTweetReplyInput>): Promise<string>;
/**
 * Post Tweet Reply Action
 */
export declare class PostTweetReplyAction implements TwitterAction<typeof PostTweetReplyInput> {
    name: string;
    description: string;
    argsSchema: z.ZodObject<{
        tweetId: z.ZodString;
        tweetReply: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tweetId: string;
        tweetReply: string;
    }, {
        tweetId: string;
        tweetReply: string;
    }>;
    func: typeof postTweet;
}
