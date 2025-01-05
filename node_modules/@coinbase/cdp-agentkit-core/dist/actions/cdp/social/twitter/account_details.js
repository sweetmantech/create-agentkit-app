"use strict";
/**
 * This module provides functionality to retrieve account details for the currently authenticated Twitter (X) user.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDetailsAction = exports.AccountDetailsInput = void 0;
exports.accountDetails = accountDetails;
const zod_1 = require("zod");
/**
 * Prompt message describing the account details tool.
 * A successful response will return account details in JSON format,
 * while a failure response will indicate an error from the Twitter API.
 */
const ACCOUNT_DETAILS_PROMPT = `
This tool will return account details for the currently authenticated Twitter (X) user context.

A successful response will return a message with the api response as a json payload:
    {"data": {"id": "1853889445319331840", "name": "CDP AgentKit", "username": "CDPAgentKit"}}

A failure response will return a message with a Twitter API request error:
    Error retrieving authenticated user account: 429 Too Many Requests
`;
/**
 * Input argument schema for the account details action.
 */
exports.AccountDetailsInput = zod_1.z
    .object({})
    .strip()
    .describe("Input schema for retrieving account details");
/**
 * Get the authenticated Twitter (X) user account details.
 *
 * @param client - The Twitter (X) client used to authenticate with.
 * @param _ - The input arguments for the action.
 * @returns A message containing account details for the authenticated user context.
 */
async function accountDetails(client, _) {
    try {
        const response = await client.v2.me();
        response.data.url = `https://x.com/${response.data.username}`;
        return `Successfully retrieved authenticated user account details:\n${JSON.stringify(response)}`;
    }
    catch (error) {
        return `Error retrieving authenticated user account details: ${error}`;
    }
}
/**
 * Account Details Action
 */
class AccountDetailsAction {
    constructor() {
        this.name = "account_details";
        this.description = ACCOUNT_DETAILS_PROMPT;
        this.argsSchema = exports.AccountDetailsInput;
        this.func = accountDetails;
    }
}
exports.AccountDetailsAction = AccountDetailsAction;
