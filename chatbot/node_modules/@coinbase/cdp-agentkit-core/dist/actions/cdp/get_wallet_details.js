"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWalletDetailsAction = exports.GetWalletDetailsInput = void 0;
exports.getWalletDetails = getWalletDetails;
const zod_1 = require("zod");
/**
 * Input schema for get wallet details action.
 * This schema intentionally accepts no parameters as the wallet is injected separately.
 */
exports.GetWalletDetailsInput = zod_1.z.object({});
/**
 * Gets a wallet's details.
 *
 * @param wallet - The wallet to get details from.
 * @param _ - The input arguments for the action.
 * @returns A message containing the wallet details.
 */
async function getWalletDetails(wallet, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_) {
    try {
        const defaultAddress = await wallet.getDefaultAddress();
        return `Wallet: ${wallet.getId()} on network: ${wallet.getNetworkId()} with default address: ${defaultAddress.getId()}`;
    }
    catch (error) {
        return `Error getting wallet details: ${error}`;
    }
}
/**
 * Get wallet details action.
 */
class GetWalletDetailsAction {
    constructor() {
        /**
         * The name of the action
         */
        this.name = "get_wallet_details";
        /**
         * A description of what the action does
         */
        this.description = "This tool will get details about the MPC Wallet.";
        /**
         * Schema for validating action arguments
         */
        this.argsSchema = exports.GetWalletDetailsInput;
        /**
         * The function to execute for this action
         */
        this.func = getWalletDetails;
    }
}
exports.GetWalletDetailsAction = GetWalletDetailsAction;
