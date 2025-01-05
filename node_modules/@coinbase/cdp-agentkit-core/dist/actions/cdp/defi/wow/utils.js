"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentSupply = getCurrentSupply;
exports.getBuyQuote = getBuyQuote;
exports.getSellQuote = getSellQuote;
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const constants_1 = require("./constants");
const utils_1 = require("./uniswap/utils");
/**
 * Gets the current supply of a token.
 *
 * @param tokenAddress - Address of the token contract
 * @returns The current token supply
 */
async function getCurrentSupply(tokenAddress) {
    const supply = await (0, coinbase_sdk_1.readContract)({
        networkId: "base-sepolia",
        contractAddress: tokenAddress,
        method: "totalSupply",
        args: {},
        abi: constants_1.WOW_ABI,
    });
    return supply;
}
/**
 * Gets quote for buying tokens.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenAddress - Address of the token contract
 * @param amountEthInWei - Amount of ETH to buy (in wei)
 * @returns The buy quote amount
 */
async function getBuyQuote(networkId, tokenAddress, amountEthInWei) {
    const hasGraduated = await (0, utils_1.getHasGraduated)(networkId, tokenAddress);
    const tokenQuote = (hasGraduated
        ? (await (0, utils_1.getUniswapQuote)(networkId, tokenAddress, Number(amountEthInWei), "buy")).amountOut
        : await (0, coinbase_sdk_1.readContract)({
            networkId: networkId,
            contractAddress: tokenAddress,
            method: "getEthBuyQuote",
            args: {
                ethOrderSize: amountEthInWei,
            },
            abi: constants_1.WOW_ABI,
        }));
    return tokenQuote.toString();
}
/**
 * Gets quote for selling tokens.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenAddress - Address of the token contract
 * @param amountTokensInWei - Amount of tokens to sell (in wei)
 * @returns The sell quote amount
 */
async function getSellQuote(networkId, tokenAddress, amountTokensInWei) {
    const hasGraduated = await (0, utils_1.getHasGraduated)(networkId, tokenAddress);
    const tokenQuote = (hasGraduated
        ? (await (0, utils_1.getUniswapQuote)(networkId, tokenAddress, Number(amountTokensInWei), "sell"))
            .amountOut
        : await (0, coinbase_sdk_1.readContract)({
            networkId: networkId,
            contractAddress: tokenAddress,
            method: "getTokenSellQuote",
            args: {
                tokenOrderSize: amountTokensInWei,
            },
            abi: constants_1.WOW_ABI,
        }));
    return tokenQuote.toString();
}
