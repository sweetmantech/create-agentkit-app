/**
 * Gets the current supply of a token.
 *
 * @param tokenAddress - Address of the token contract
 * @returns The current token supply
 */
export declare function getCurrentSupply(tokenAddress: string): Promise<string>;
/**
 * Gets quote for buying tokens.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenAddress - Address of the token contract
 * @param amountEthInWei - Amount of ETH to buy (in wei)
 * @returns The buy quote amount
 */
export declare function getBuyQuote(networkId: string, tokenAddress: string, amountEthInWei: string): Promise<string>;
/**
 * Gets quote for selling tokens.
 *
 * @param networkId - Network ID, either base-sepolia or base-mainnet
 * @param tokenAddress - Address of the token contract
 * @param amountTokensInWei - Amount of tokens to sell (in wei)
 * @returns The sell quote amount
 */
export declare function getSellQuote(networkId: string, tokenAddress: string, amountTokensInWei: string): Promise<string>;
