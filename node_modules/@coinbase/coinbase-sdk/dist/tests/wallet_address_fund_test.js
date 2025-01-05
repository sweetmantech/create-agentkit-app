"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_address_1 = require("../coinbase/address/wallet_address");
const fund_operation_1 = require("../coinbase/fund_operation");
const fund_quote_1 = require("../coinbase/fund_quote");
const utils_1 = require("./utils");
const decimal_js_1 = require("decimal.js");
describe("WalletAddress Fund", () => {
    let walletAddress;
    const walletId = "test-wallet-id";
    const addressId = "0x123abc...";
    beforeEach(() => {
        walletAddress = new wallet_address_1.WalletAddress((0, utils_1.newAddressModel)(walletId, addressId));
        jest.spyOn(fund_operation_1.FundOperation, "create").mockResolvedValue({});
        jest.spyOn(fund_quote_1.FundQuote, "create").mockResolvedValue({});
        jest
            .spyOn(fund_operation_1.FundOperation, "listFundOperations")
            .mockResolvedValue({});
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("#fund", () => {
        it("should call FundOperation.create with correct parameters when passing in decimal amount", async () => {
            const amount = new decimal_js_1.Decimal("1.0");
            const assetId = "eth";
            await walletAddress.fund({ amount, assetId });
            expect(fund_operation_1.FundOperation.create).toHaveBeenCalledWith(walletId, addressId, amount, assetId, walletAddress.getNetworkId());
        });
        it("should call FundOperation.create with correct parameters when passing in number amount", async () => {
            const amount = 1;
            const assetId = "eth";
            await walletAddress.fund({ amount, assetId });
            expect(fund_operation_1.FundOperation.create).toHaveBeenCalledWith(walletId, addressId, new decimal_js_1.Decimal(amount), assetId, walletAddress.getNetworkId());
        });
        it("should call FundOperation.create with correct parameters when passing in bigint amount", async () => {
            const amount = BigInt(1);
            const assetId = "eth";
            await walletAddress.fund({ amount, assetId });
            expect(fund_operation_1.FundOperation.create).toHaveBeenCalledWith(walletId, addressId, new decimal_js_1.Decimal(amount.toString()), assetId, walletAddress.getNetworkId());
        });
    });
    describe("#quoteFund", () => {
        it("should call FundQuote.create with correct parameters when passing in decimal amount", async () => {
            const amount = new decimal_js_1.Decimal("1.0");
            const assetId = "eth";
            await walletAddress.quoteFund({ amount, assetId });
            expect(fund_quote_1.FundQuote.create).toHaveBeenCalledWith(walletId, addressId, amount, assetId, walletAddress.getNetworkId());
        });
        it("should call FundQuote.create with correct parameters when passing in number amount", async () => {
            const amount = 1;
            const assetId = "eth";
            await walletAddress.quoteFund({ amount, assetId });
            expect(fund_quote_1.FundQuote.create).toHaveBeenCalledWith(walletId, addressId, new decimal_js_1.Decimal(amount), assetId, walletAddress.getNetworkId());
        });
        it("should call FundQuote.create with correct parameters when passing in bigint amount", async () => {
            const amount = BigInt(1);
            const assetId = "eth";
            await walletAddress.quoteFund({ amount, assetId });
            expect(fund_quote_1.FundQuote.create).toHaveBeenCalledWith(walletId, addressId, new decimal_js_1.Decimal(amount.toString()), assetId, walletAddress.getNetworkId());
        });
    });
    describe("#listFundOperations", () => {
        it("should call listFundOperations with correct parameters", async () => {
            await walletAddress.listFundOperations({ limit: 10, page: "test-page" });
            expect(fund_operation_1.FundOperation.listFundOperations).toHaveBeenCalledWith(walletId, addressId, {
                limit: 10,
                page: "test-page",
            });
        });
    });
});
