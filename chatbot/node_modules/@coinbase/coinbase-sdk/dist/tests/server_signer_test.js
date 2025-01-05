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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const coinbase_1 = require("../coinbase/coinbase");
const api_error_1 = require("../coinbase/api_error");
const utils_1 = require("./utils");
const server_signer_1 = require("../coinbase/server_signer");
describe("ServerSigner", () => {
    let serverSigner;
    const serverSignerId = crypto.randomUUID();
    const wallets = Array.from({ length: 3 }, () => crypto.randomUUID());
    const model = {
        server_signer_id: serverSignerId,
        wallets: wallets,
        is_mpc: true,
    };
    const serverSignerList = {
        data: [model],
        total_count: 1,
        has_more: false,
        next_page: "",
    };
    const emptyServerSignerList = {
        data: [],
        total_count: 0,
        has_more: false,
        next_page: "",
    };
    beforeAll(async () => {
        coinbase_1.Coinbase.apiClients.serverSigner = utils_1.serverSignersApiMock;
        coinbase_1.Coinbase.apiClients.serverSigner.listServerSigners = (0, utils_1.mockReturnValue)(serverSignerList);
        serverSigner = await server_signer_1.ServerSigner.getDefault();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe(".getDefault", () => {
        describe("when a default Server-Signer exists", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.serverSigner.listServerSigners = (0, utils_1.mockReturnValue)(serverSignerList);
            });
            it("should return the default Server-Signer", async () => {
                const defaultServerSigner = await server_signer_1.ServerSigner.getDefault();
                expect(defaultServerSigner).toBeInstanceOf(server_signer_1.ServerSigner);
                expect(defaultServerSigner.getId()).toBe(serverSignerId);
                expect(defaultServerSigner.getWallets()).toBe(wallets);
                expect(coinbase_1.Coinbase.apiClients.serverSigner.listServerSigners).toHaveBeenCalledTimes(1);
            });
        });
        it("should throw an APIError when the request is unsuccessful", async () => {
            coinbase_1.Coinbase.apiClients.serverSigner.listServerSigners = (0, utils_1.mockReturnRejectedValue)(new api_error_1.APIError("Failed to list Server-Signers"));
            await expect(server_signer_1.ServerSigner.getDefault()).rejects.toThrow(api_error_1.APIError);
            expect(coinbase_1.Coinbase.apiClients.serverSigner.listServerSigners).toHaveBeenCalledTimes(1);
        });
        describe("when a default Server-Signer does not exist", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.serverSigner.listServerSigners =
                    (0, utils_1.mockReturnValue)(emptyServerSignerList);
            });
            it("should return an error", async () => {
                await expect(server_signer_1.ServerSigner.getDefault()).rejects.toThrow(new Error("No Server-Signer is associated with the project"));
            });
        });
    });
    describe("#getId", () => {
        it("should return the Server-Signer ID", async () => {
            expect(serverSigner.getId()).toBe(serverSignerId);
        });
    });
    describe("#getWallets", () => {
        it("should return the list of Wallet IDs", async () => {
            expect(serverSigner.getWallets()).toBe(wallets);
        });
    });
    describe("#toString", () => {
        it("should return the correct string representation", async () => {
            expect(serverSigner.toString()).toBe(`ServerSigner{id: '${serverSignerId}', wallets: '${wallets}'}`);
        });
    });
});
