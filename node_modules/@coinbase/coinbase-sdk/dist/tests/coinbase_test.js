"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const crypto_1 = require("crypto");
const api_error_1 = require("../coinbase/api_error");
const index_1 = require("../index");
const wallet_1 = require("../coinbase/wallet");
const client_1 = require("../client");
const utils_1 = require("./utils");
const ethers_1 = require("ethers");
const path_1 = __importDefault(require("path"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const axios_1 = __importDefault(require("axios"));
const PATH_PREFIX = "./src/tests/config";
describe("Coinbase tests", () => {
    describe(".networks", () => {
        it("returns a map of networks that match the api generated NetworkIdentifier", () => {
            expect(index_1.Coinbase.networks).toEqual(client_1.NetworkIdentifier);
        });
        it("returns the network ID when selecting a specific network", () => {
            expect(index_1.Coinbase.networks.BaseSepolia).toEqual("base-sepolia");
        });
    });
    it("should throw an error if the API key name or private key is empty", () => {
        expect(() => index_1.Coinbase.configure({ apiKeyName: "", privateKey: "test" })).toThrow("Invalid configuration: apiKeyName is empty");
        expect(() => index_1.Coinbase.configure({ apiKeyName: "test", privateKey: "" })).toThrow("Invalid configuration: privateKey is empty");
    });
    it("should throw an error if the file does not exist", () => {
        expect(() => index_1.Coinbase.configureFromJson({ filePath: `${PATH_PREFIX}/does-not-exist.json` })).toThrow("Invalid configuration: file not found at ./src/tests/config/does-not-exist.json");
    });
    it("should initialize the Coinbase SDK from a JSON file", () => {
        const cbInstance = index_1.Coinbase.configureFromJson({
            filePath: `${PATH_PREFIX}/test_api_key.json`,
        });
        expect(cbInstance).toBeInstanceOf(index_1.Coinbase);
    });
    it("should throw an error if there is an issue reading the file or parsing the JSON data", () => {
        expect(() => index_1.Coinbase.configureFromJson({ filePath: `${PATH_PREFIX}/invalid.json` })).toThrow("Invalid configuration: missing configuration values");
    });
    it("should throw an error if the JSON file is not parseable", () => {
        expect(() => index_1.Coinbase.configureFromJson({ filePath: `${PATH_PREFIX}/not_parseable.json` })).toThrow("Not able to parse the configuration file");
    });
    it("should expand the tilde to the home directory", () => {
        const configuration = fs.readFileSync(`${PATH_PREFIX}/test_api_key.json`, "utf8");
        const homeDir = os.homedir();
        const relativePath = "~/test_config.json";
        const expandedPath = path_1.default.join(homeDir, "test_config.json");
        fs.writeFileSync(expandedPath, configuration, "utf8");
        const cbInstance = index_1.Coinbase.configureFromJson({ filePath: relativePath });
        expect(cbInstance).toBeInstanceOf(index_1.Coinbase);
        fs.unlinkSync(expandedPath);
    });
    describe("should able to interact with the API", () => {
        let walletId, publicKey, addressId, transactionHash;
        const cbInstance = index_1.Coinbase.configureFromJson({
            filePath: `${PATH_PREFIX}/test_api_key.json`,
            debugging: true,
        });
        beforeEach(async () => {
            jest.clearAllMocks();
            index_1.Coinbase.apiClients = {
                wallet: utils_1.walletsApiMock,
                address: utils_1.addressesApiMock,
            };
            const ethAddress = ethers_1.ethers.Wallet.createRandom();
            walletId = (0, crypto_1.randomUUID)();
            publicKey = ethAddress.publicKey;
            addressId = (0, crypto_1.randomUUID)();
            transactionHash = (0, utils_1.generateRandomHash)(8);
            const walletModel = {
                id: walletId,
                network_id: index_1.Coinbase.networks.BaseSepolia,
                default_address: {
                    wallet_id: walletId,
                    address_id: addressId,
                    public_key: publicKey,
                    network_id: index_1.Coinbase.networks.BaseSepolia,
                },
            };
            index_1.Coinbase.apiClients.wallet.createWallet = (0, utils_1.mockReturnValue)(walletModel);
            index_1.Coinbase.apiClients.wallet.getWallet = (0, utils_1.mockReturnValue)(walletModel);
            index_1.Coinbase.apiClients.address.createAddress = (0, utils_1.mockReturnValue)(utils_1.VALID_WALLET_MODEL.default_address);
        });
        it("enables interaction with the API clients", async () => {
            const wallet = await wallet_1.Wallet.create({ networkId: client_1.NetworkIdentifier.BaseSepolia });
            expect(wallet.getId()).toEqual(walletId);
        });
    });
});
describe("Axios Interceptors", () => {
    it("should raise an error if the user is not found", async () => {
        const mock = new axios_mock_adapter_1.default(axios_1.default);
        mock.onGet("/v1/wallets").reply(401, "unauthorized");
        const cbInstance = index_1.Coinbase.configureFromJson({
            filePath: `${PATH_PREFIX}/test_api_key.json`,
            debugging: true,
        });
        await expect(wallet_1.Wallet.listWallets()).rejects.toThrow(api_error_1.APIError);
    });
});
