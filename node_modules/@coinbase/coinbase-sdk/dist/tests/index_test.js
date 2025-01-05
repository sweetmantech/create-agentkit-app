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
// test/index.test.ts
const index = __importStar(require("../index"));
describe("Index file exports", () => {
    it("should export all modules correctly", () => {
        expect(index).toBeDefined();
        expect(index).toHaveProperty("Address");
        expect(index).toHaveProperty("APIError");
        expect(index).toHaveProperty("Asset");
        expect(index).toHaveProperty("Balance");
        expect(index).toHaveProperty("BalanceMap");
        expect(index).toHaveProperty("Coinbase");
        expect(index).toHaveProperty("ContractEvent");
        expect(index).toHaveProperty("ContractInvocation");
        expect(index).toHaveProperty("ExternalAddress");
        expect(index).toHaveProperty("FaucetTransaction");
        expect(index).toHaveProperty("GWEI_DECIMALS");
        expect(index).toHaveProperty("HistoricalBalance");
        expect(index).toHaveProperty("InvalidAPIKeyFormatError");
        expect(index).toHaveProperty("PayloadSignature");
        expect(index).toHaveProperty("ServerSigner");
        expect(index).toHaveProperty("SmartContract");
        expect(index).toHaveProperty("SponsoredSendStatus");
        expect(index).toHaveProperty("StakeOptionsMode");
        expect(index).toHaveProperty("StakingBalance");
        expect(index).toHaveProperty("StakingOperation");
        expect(index).toHaveProperty("StakingReward");
        expect(index).toHaveProperty("Trade");
        expect(index).toHaveProperty("Transaction");
        expect(index).toHaveProperty("TransactionStatus");
        expect(index).toHaveProperty("Transfer");
        expect(index).toHaveProperty("TransferStatus");
        expect(index).toHaveProperty("Validator");
        expect(index).toHaveProperty("Wallet");
        expect(index).toHaveProperty("WalletAddress");
        expect(index).toHaveProperty("Webhook");
        expect(index).toHaveProperty("CryptoAmount");
        expect(index).toHaveProperty("FiatAmount");
        expect(index).toHaveProperty("FundOperation");
        expect(index).toHaveProperty("FundQuote");
    });
});
