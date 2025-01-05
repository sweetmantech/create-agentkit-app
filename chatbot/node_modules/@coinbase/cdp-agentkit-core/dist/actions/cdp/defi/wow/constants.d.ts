import type { Abi } from "abitype";
export declare const WOW_FACTORY_ABI: Abi;
export declare const WOW_ABI: Abi;
export declare const WOW_FACTORY_CONTRACT_ADDRESSES: Record<string, string>;
export declare const ADDRESSES: Record<string, Record<string, string>>;
export declare const GENERIC_TOKEN_METADATA_URI = "ipfs://QmY1GqprFYvojCcUEKgqHeDj9uhZD9jmYGrQTfA9vAE78J";
/**
 * Gets the Zora Wow ERC20 Factory contract address for the specified network.
 *
 * @param network - The network ID to get the contract address for
 * @returns The contract address for the specified network
 * @throws Error if the specified network is not supported
 */
export declare function getFactoryAddress(network: string): string;
