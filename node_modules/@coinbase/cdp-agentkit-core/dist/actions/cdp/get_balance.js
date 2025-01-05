"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalanceAction = exports.GetBalanceInput = void 0;
exports.getBalance = getBalance;
const zod_1 = require("zod");
const GET_BALANCE_PROMPT = `
This tool will get the balance of all the addresses in the wallet for a given asset. 
It takes the asset ID as input. Always use 'eth' for the native asset ETH and 'usdc' for USDC.
`;
/**
 * Input schema for get balance action.
 */
exports.GetBalanceInput = zod_1.z
    .object({
    assetId: zod_1.z.string().describe("The asset ID to get the balance for"),
})
    .strip()
    .describe("Instructions for getting wallet balance");
/**
 * Gets balance for all addresses in the wallet for a given asset.
 *
 * @param wallet - The wallet to get the balance for.
 * @param args - The input arguments for the action.
 * @returns A message containing the balance information.
 */
async function getBalance(wallet, args) {
    const balances = {};
    try {
        const addresses = await wallet.listAddresses();
        for (const address of addresses) {
            const balance = await address.getBalance(args.assetId);
            balances[address.getId()] = balance;
        }
        const balanceLines = Object.entries(balances).map(([addr, balance]) => `${addr}: ${balance}`);
        const formattedBalances = balanceLines.join("\n");
        return `Balances for wallet ${wallet.getId()}:\n${formattedBalances}`;
    }
    catch (error) {
        return `Error getting balance for all addresses in the wallet: ${error}`;
    }
}
/**
 * Get wallet balance action.
 */
class GetBalanceAction {
    constructor() {
        this.name = "get_balance";
        this.description = GET_BALANCE_PROMPT;
        this.argsSchema = exports.GetBalanceInput;
        this.func = getBalance;
    }
}
exports.GetBalanceAction = GetBalanceAction;
