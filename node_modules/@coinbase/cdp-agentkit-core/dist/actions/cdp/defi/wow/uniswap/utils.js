"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceInfo = createPriceInfo;
exports.getPoolInfo = getPoolInfo;
exports.exactInputSingle = exactInputSingle;
exports.getUniswapQuote = getUniswapQuote;
exports.getHasGraduated = getHasGraduated;
exports.getPoolAddress = getPoolAddress;
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const viem_1 = require("viem");
const constants_1 = require("../constants");
const constants_2 = require("./constants");
/**
 * Creates a PriceInfo object from wei amount and ETH price.
 *
 * @param weiAmount - Amount in wei
 * @param ethPriceInUsd - Current ETH price in USD
 * @returns A PriceInfo object containing the amount in ETH and USD
 */
function createPriceInfo(weiAmount, ethPriceInUsd) {
    const amountInEth = (0, viem_1.formatEther)(BigInt(weiAmount));
    const usd = Number(amountInEth) * ethPriceInUsd;
    return {
        eth: weiAmount,
        usd,
    };
}
/**
 * Gets pool info for a given uniswap v3 pool address.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param poolAddress - Uniswap v3 pool address
 * @returns A PoolInfo object containing pool details
 */
async function getPoolInfo(networkId, poolAddress) {
    try {
        const results = await Promise.all([
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: poolAddress,
                method: "token0",
                args: {},
                abi: constants_2.UNISWAP_V3_ABI,
            }),
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: poolAddress,
                method: "token1",
                args: {},
                abi: constants_2.UNISWAP_V3_ABI,
            }),
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: poolAddress,
                method: "fee",
                args: {},
                abi: constants_2.UNISWAP_V3_ABI,
            }),
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: poolAddress,
                method: "liquidity",
                args: {},
                abi: constants_2.UNISWAP_V3_ABI,
            }),
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: poolAddress,
                method: "slot0",
                args: {},
                abi: constants_2.UNISWAP_V3_ABI,
            }),
        ]);
        const [token0Result, token1Result, fee, liquidity, slot0] = results;
        const [balance0, balance1] = await Promise.all([
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: token0Result,
                method: "balanceOf",
                args: { account: poolAddress },
                abi: constants_1.WOW_ABI,
            }),
            (0, coinbase_sdk_1.readContract)({
                networkId: networkId,
                contractAddress: token1Result,
                method: "balanceOf",
                args: { account: poolAddress },
                abi: constants_1.WOW_ABI,
            }),
        ]);
        return {
            token0: token0Result,
            balance0: Number(balance0),
            token1: token1Result,
            balance1: Number(balance1),
            fee: Number(fee),
            liquidity: Number(liquidity),
            sqrtPriceX96: Number(slot0[0]),
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch pool information: ${error}`);
    }
}
/**
 * Gets exact input quote from Uniswap.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenIn - Token address to swap from
 * @param tokenOut - Token address to swap to
 * @param amountIn - Amount of tokens to swap (in Wei)
 * @param fee - Fee for the swap
 * @returns Amount of tokens to receive (in Wei)
 */
async function exactInputSingle(networkId, tokenIn, tokenOut, amountIn, fee) {
    try {
        const amount = await (0, coinbase_sdk_1.readContract)({
            networkId: networkId,
            contractAddress: constants_1.ADDRESSES[networkId].UniswapQuoter,
            method: "quoteExactInputSingle",
            args: {
                tokenIn: (0, viem_1.getAddress)(tokenIn),
                tokenOut: (0, viem_1.getAddress)(tokenOut),
                fee,
                amountIn,
                sqrtPriceLimitX96: 0,
            },
            abi: constants_2.UNISWAP_QUOTER_ABI,
        });
        return Number(amount);
    }
    catch (error) {
        console.error("Quoter error:", error);
        return 0;
    }
}
/**
 * Gets Uniswap quote for buying or selling tokens.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenAddress - Token address
 * @param amount - Amount of tokens (in Wei)
 * @param quoteType - 'buy' or 'sell'
 * @returns A Quote object containing quote details
 */
async function getUniswapQuote(networkId, tokenAddress, amount, quoteType) {
    let pool = null;
    let tokens = null;
    let balances = null;
    let quoteResult = null;
    const utilization = 0;
    const poolAddress = await getPoolAddress(tokenAddress);
    const invalidPoolError = !poolAddress ? "Invalid pool address" : null;
    try {
        pool = await getPoolInfo(networkId, poolAddress);
        const { token0, token1, balance0, balance1, fee } = pool;
        tokens = [token0, token1];
        balances = [balance0, balance1];
        const isToken0Weth = token0.toLowerCase() === constants_1.ADDRESSES[networkId].WETH.toLowerCase();
        const tokenIn = (quoteType === "buy" && isToken0Weth) || (quoteType === "sell" && !isToken0Weth)
            ? token0
            : token1;
        const [tokenOut, balanceOut] = tokenIn === token0 ? [token1, balance1] : [token0, balance0];
        const isInsufficientLiquidity = quoteType === "buy" && amount > balanceOut;
        if (!isInsufficientLiquidity) {
            quoteResult = await exactInputSingle(networkId, tokenIn, tokenOut, String(amount), String(fee));
        }
    }
    catch (error) {
        console.error("Error fetching quote:", error);
    }
    const insufficientLiquidity = (quoteType === "sell" && pool && !quoteResult) || false;
    let errorMsg = null;
    if (!pool) {
        errorMsg = "Failed fetching pool";
    }
    else if (insufficientLiquidity) {
        errorMsg = "Insufficient liquidity";
    }
    else if (!quoteResult && utilization >= 0.9) {
        errorMsg = "Price impact too high";
    }
    else if (!quoteResult) {
        errorMsg = "Failed fetching quote";
    }
    const balanceResult = tokens && balances
        ? {
            erc20z: String(balances[tokens[0].toLowerCase() === constants_1.ADDRESSES[networkId].WETH.toLowerCase() ? 1 : 0]),
            weth: String(balances[tokens[0].toLowerCase() === constants_1.ADDRESSES[networkId].WETH.toLowerCase() ? 0 : 1]),
        }
        : null;
    return {
        amountIn: Number(amount),
        amountOut: quoteResult || 0,
        balance: balanceResult,
        fee: pool?.fee ? pool.fee / 1000000 : null,
        error: invalidPoolError || errorMsg,
    };
}
/**
 * Checks if a token has graduated from the Zora Wow protocol.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenAddress - Token address
 * @returns True if the token has graduated, false otherwise
 */
async function getHasGraduated(networkId, tokenAddress) {
    const marketType = await (0, coinbase_sdk_1.readContract)({
        networkId: networkId,
        contractAddress: tokenAddress,
        method: "marketType",
        args: {},
        abi: constants_1.WOW_ABI,
    });
    return marketType === 1;
}
/**
 * Fetches the uniswap v3 pool address for a given token.
 *
 * @param tokenAddress - The address of the token contract
 * @returns The uniswap v3 pool address associated with the token
 */
async function getPoolAddress(tokenAddress) {
    const poolAddress = await (0, coinbase_sdk_1.readContract)({
        networkId: "base-sepolia",
        contractAddress: tokenAddress,
        method: "poolAddress",
        args: {},
        abi: constants_1.WOW_ABI,
    });
    return poolAddress;
}
