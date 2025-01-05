/**
 * This module exports various Twitter (X) action instances and their associated types.
 */
import { TwitterAction, TwitterActionSchemaAny } from "./twitter_action";
import { AccountDetailsAction } from "./account_details";
import { AccountMentionsAction } from "./account_mentions";
import { PostTweetAction } from "./post_tweet";
import { PostTweetReplyAction } from "./post_tweet_reply";
/**
 * Retrieve an array of Twitter (X) action instances.
 *
 * @returns {TwitterAction<TwitterActionSchemaAny>[]} An array of Twitter action instances.
 */
export declare function getAllTwitterActions(): TwitterAction<TwitterActionSchemaAny>[];
/**
 * All available Twitter (X) actions.
 */
export declare const TWITTER_ACTIONS: TwitterAction<TwitterActionSchemaAny>[];
/**
 * All Twitter (X) action types.
 */
export { TwitterAction, TwitterActionSchemaAny, AccountDetailsAction, AccountMentionsAction, PostTweetAction, PostTweetReplyAction, };
