"use strict";
/**
 * This module provides functionality to post a reply to a tweet on Twitter (X).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTweetReplyAction = exports.PostTweetReplyInput = void 0;
exports.postTweet = postTweet;
const zod_1 = require("zod");
/**
 * Prompt message describing the post tweet reply tool.
 * A successful response will return a message with the API response in JSON format,
 * while a failure response will indicate an error from the Twitter API.
 */
const POST_TWEET_REPLY_PROMPT = `
This tool will post a tweet on Twitter. The tool takes the text of the tweet as input. Tweets can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {"data": {"text": "hello, world!", "id": "0123456789012345678", "edit_history_tweet_ids": ["0123456789012345678"]}}

A failure response will return a message with the Twitter API request error:
    You are not allowed to create a Tweet with duplicate content.
`;
/**
 * Input argument schema for the post tweet reply action.
 */
exports.PostTweetReplyInput = zod_1.z
    .object({
    tweetId: zod_1.z.string().describe("The id of the tweet to reply to"),
    tweetReply: zod_1.z
        .string()
        .max(280, "The reply to the tweet which must be a maximum of 280 characters."),
})
    .strip()
    .describe("Input schema for posting a tweet reply");
/**
 * Posts a reply to a specified tweet on Twitter (X).
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param args - The input arguments for the action.
 * @returns A message indicating the success or failure of the reply posting.
 */
async function postTweet(client, args) {
    try {
        const response = await client.v2.tweet(args.tweetReply, {
            reply: { in_reply_to_tweet_id: args.tweetId },
        });
        return `Successfully posted reply to Twitter:\n${JSON.stringify(response)}`;
    }
    catch (error) {
        return `Error posting reply to Twitter: ${error}`;
    }
}
/**
 * Post Tweet Reply Action
 */
class PostTweetReplyAction {
    constructor() {
        this.name = "post_tweet_reply";
        this.description = POST_TWEET_REPLY_PROMPT;
        this.argsSchema = exports.PostTweetReplyInput;
        this.func = postTweet;
    }
}
exports.PostTweetReplyAction = PostTweetReplyAction;
