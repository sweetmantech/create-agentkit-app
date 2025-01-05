"use strict";
/**
 * This module exports various Twitter (X) action instances and their associated types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTweetReplyAction = exports.PostTweetAction = exports.AccountMentionsAction = exports.AccountDetailsAction = exports.TWITTER_ACTIONS = void 0;
exports.getAllTwitterActions = getAllTwitterActions;
const account_details_1 = require("./account_details");
Object.defineProperty(exports, "AccountDetailsAction", { enumerable: true, get: function () { return account_details_1.AccountDetailsAction; } });
const account_mentions_1 = require("./account_mentions");
Object.defineProperty(exports, "AccountMentionsAction", { enumerable: true, get: function () { return account_mentions_1.AccountMentionsAction; } });
const post_tweet_1 = require("./post_tweet");
Object.defineProperty(exports, "PostTweetAction", { enumerable: true, get: function () { return post_tweet_1.PostTweetAction; } });
const post_tweet_reply_1 = require("./post_tweet_reply");
Object.defineProperty(exports, "PostTweetReplyAction", { enumerable: true, get: function () { return post_tweet_reply_1.PostTweetReplyAction; } });
/**
 * Retrieve an array of Twitter (X) action instances.
 *
 * @returns {TwitterAction<TwitterActionSchemaAny>[]} An array of Twitter action instances.
 */
function getAllTwitterActions() {
    return [
        new account_details_1.AccountDetailsAction(),
        new account_mentions_1.AccountMentionsAction(),
        new post_tweet_reply_1.PostTweetReplyAction(),
        new post_tweet_1.PostTweetAction(),
    ];
}
/**
 * All available Twitter (X) actions.
 */
exports.TWITTER_ACTIONS = getAllTwitterActions();
