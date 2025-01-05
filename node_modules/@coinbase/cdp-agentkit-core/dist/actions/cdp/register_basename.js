"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterBasenameAction = exports.RegisterBasenameInput = exports.REGISTRAR_ABI = exports.L2_RESOLVER_ABI = exports.REGISTRATION_DURATION = exports.L2_RESOLVER_ADDRESS_TESTNET = exports.L2_RESOLVER_ADDRESS_MAINNET = exports.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET = exports.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET = void 0;
exports.registerBasename = registerBasename;
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const viem_1 = require("viem");
const zod_1 = require("zod");
const decimal_js_1 = require("decimal.js");
const REGISTER_BASENAME_PROMPT = `
This tool will register a Basename for the agent. The agent should have a wallet associated to register a Basename.
When your network ID is 'base-mainnet' (also sometimes known simply as 'base'), the name must end with .base.eth, and when your network ID is 'base-sepolia', it must ends with .basetest.eth.
Do not suggest any alternatives and never try to register a Basename with another postfix. The prefix of the name must be unique so if the registration of the
Basename fails, you should prompt to try again with a more unique name.
`;
// Contract addresses
exports.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET = "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5";
exports.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET = "0x49aE3cC2e3AA768B1e5654f5D3C6002144A59581";
exports.L2_RESOLVER_ADDRESS_MAINNET = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";
exports.L2_RESOLVER_ADDRESS_TESTNET = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";
// Default registration duration (1 year in seconds)
exports.REGISTRATION_DURATION = "31557600";
// Relevant ABI for L2 Resolver Contract.
exports.L2_RESOLVER_ABI = [
    {
        inputs: [
            { internalType: "bytes32", name: "node", type: "bytes32" },
            { internalType: "address", name: "a", type: "address" },
        ],
        name: "setAddr",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "node", type: "bytes32" },
            { internalType: "string", name: "newName", type: "string" },
        ],
        name: "setName",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
// Relevant ABI for Basenames Registrar Controller Contract.
exports.REGISTRAR_ABI = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "name",
                        type: "string",
                    },
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "duration",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "resolver",
                        type: "address",
                    },
                    {
                        internalType: "bytes[]",
                        name: "data",
                        type: "bytes[]",
                    },
                    {
                        internalType: "bool",
                        name: "reverseRecord",
                        type: "bool",
                    },
                ],
                internalType: "struct RegistrarController.RegisterRequest",
                name: "request",
                type: "tuple",
            },
        ],
        name: "register",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];
/**
 * Input schema for registering a Basename.
 */
exports.RegisterBasenameInput = zod_1.z
    .object({
    basename: zod_1.z.string().describe("The Basename to assign to the agent"),
    amount: zod_1.z.string().default("0.002").describe("The amount of ETH to pay for registration"),
})
    .strip()
    .describe("Instructions for registering a Basename");
/**
 * Creates registration arguments for Basenames.
 *
 * @param baseName - The Basename (e.g., "example.base.eth" or "example.basetest.eth").
 * @param addressId - The Ethereum address.
 * @param isMainnet - True if on mainnet, False if on testnet.
 * @returns Formatted arguments for the register contract method.
 */
function createRegisterContractMethodArgs(baseName, addressId, isMainnet) {
    const l2ResolverAddress = isMainnet ? exports.L2_RESOLVER_ADDRESS_MAINNET : exports.L2_RESOLVER_ADDRESS_TESTNET;
    const suffix = isMainnet ? ".base.eth" : ".basetest.eth";
    const addressData = (0, viem_1.encodeFunctionData)({
        abi: exports.L2_RESOLVER_ABI,
        functionName: "setAddr",
        args: [(0, viem_1.namehash)(baseName), addressId],
    });
    const nameData = (0, viem_1.encodeFunctionData)({
        abi: exports.L2_RESOLVER_ABI,
        functionName: "setName",
        args: [(0, viem_1.namehash)(baseName), baseName],
    });
    const registerArgs = {
        request: [
            baseName.replace(suffix, ""),
            addressId,
            exports.REGISTRATION_DURATION,
            l2ResolverAddress,
            [addressData, nameData],
            true,
        ],
    };
    return registerArgs;
}
/**
 * Registers a Basename for the agent.
 *
 * @param wallet - The wallet to register the Basename with.
 * @param args - The input arguments for the action.
 * @returns Confirmation message with the basename.
 */
async function registerBasename(wallet, args) {
    const addressId = (await wallet.getDefaultAddress()).getId();
    const isMainnet = wallet.getNetworkId() === coinbase_sdk_1.Coinbase.networks.BaseMainnet;
    const suffix = isMainnet ? ".base.eth" : ".basetest.eth";
    if (!args.basename.endsWith(suffix)) {
        args.basename += suffix;
    }
    const registerArgs = createRegisterContractMethodArgs(args.basename, addressId, isMainnet);
    try {
        const contractAddress = isMainnet
            ? exports.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET
            : exports.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET;
        const invocation = await wallet.invokeContract({
            contractAddress,
            method: "register",
            args: registerArgs,
            abi: exports.REGISTRAR_ABI,
            amount: new decimal_js_1.Decimal(args.amount),
            assetId: "eth",
        });
        await invocation.wait();
        return `Successfully registered basename ${args.basename} for address ${addressId}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        return `Error registering basename: Error: ${error}`;
    }
}
/**
 * Register Basename action.
 */
class RegisterBasenameAction {
    constructor() {
        this.name = "register_basename";
        this.description = REGISTER_BASENAME_PROMPT;
        this.argsSchema = exports.RegisterBasenameInput;
        this.func = registerBasename;
    }
}
exports.RegisterBasenameAction = RegisterBasenameAction;
