"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferAction = exports.TransferInput = void 0;
exports.transfer = transfer;
const zod_1 = require("zod");
const TRANSFER_PROMPT = `
This tool will transfer an asset from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer
- assetId: The asset ID to transfer
- destination: Where to send the funds (can be an onchain address, ENS 'example.eth', or Basename 'example.base.eth')
- gasless: Whether to do a gasless transfer

Important notes:
- Gasless transfers are only available on base-sepolia and base-mainnet (base) networks for 'usdc' asset
- Always use gasless transfers when available
- Always use asset ID 'usdc' when transferring USDC
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'eth' on base-mainnet), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
`;
/**
 * Input schema for transfer action.
 */
exports.TransferInput = zod_1.z
    .object({
    amount: zod_1.z.custom().describe("The amount of the asset to transfer"),
    assetId: zod_1.z.string().describe("The asset ID to transfer"),
    destination: zod_1.z.string().describe("The destination to transfer the funds"),
    gasless: zod_1.z.boolean().default(false).describe("Whether to do a gasless transfer"),
})
    .strip()
    .describe("Instructions for transferring assets");
/**
 * Transfers a specified amount of an asset to a destination onchain.
 *
 * @param wallet - The wallet to transfer the asset from.
 * @param args - The input arguments for the action.
 * @returns A message containing the transfer details.
 */
async function transfer(wallet, args) {
    try {
        const transferResult = await wallet.createTransfer({
            amount: args.amount,
            assetId: args.assetId,
            destination: args.destination,
            gasless: args.gasless,
        });
        const result = await transferResult.wait();
        return `Transferred ${args.amount} of ${args.assetId} to ${args.destination}.\nTransaction hash for the transfer: ${result.getTransactionHash()}\nTransaction link for the transfer: ${result.getTransactionLink()}`;
    }
    catch (error) {
        return `Error transferring the asset: ${error}`;
    }
}
/**
 * Transfer action.
 */
class TransferAction {
    constructor() {
        this.name = "transfer";
        this.description = TRANSFER_PROMPT;
        this.argsSchema = exports.TransferInput;
        this.func = transfer;
    }
}
exports.TransferAction = TransferAction;
