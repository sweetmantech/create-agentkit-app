"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("../coinbase/wallet");
const wallet_address_1 = require("../coinbase/address/wallet_address");
const utils_1 = require("./utils");
const decimal_js_1 = require("decimal.js");
const __1 = require("..");
describe("Wallet Fund", () => {
    let wallet;
    let walletModel;
    let defaultAddress;
    const walletId = "test-wallet-id";
    const addressId = "0x123abc...";
    beforeEach(() => {
        const addressModel = (0, utils_1.newAddressModel)(walletId, addressId);
        defaultAddress = new wallet_address_1.WalletAddress(addressModel);
        walletModel = {
            id: walletId,
            network_id: __1.Coinbase.networks.BaseSepolia,
            default_address: addressModel,
            feature_set: {},
        };
        wallet = wallet_1.Wallet.init(walletModel, "");
        // Mock getDefaultAddress to return our test address
        jest.spyOn(wallet, "getDefaultAddress").mockResolvedValue(defaultAddress);
        // Mock the fund and quoteFund methods on the default address
        jest.spyOn(defaultAddress, "fund").mockResolvedValue({});
        jest.spyOn(defaultAddress, "quoteFund").mockResolvedValue({});
        jest
            .spyOn(defaultAddress, "listFundOperations")
            .mockResolvedValue({});
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("#fund", () => {
        it("should call defaultAddress.fund with correct parameters when passing in decimal amount", async () => {
            const amount = new decimal_js_1.Decimal("1.0");
            const assetId = "eth";
            await wallet.fund({ amount, assetId });
            expect(defaultAddress.fund).toHaveBeenCalledWith({ amount, assetId });
        });
        it("should call defaultAddress.fund with correct parameters when passing in number amount", async () => {
            const amount = 1;
            const assetId = "eth";
            await wallet.fund({ amount, assetId });
            expect(defaultAddress.fund).toHaveBeenCalledWith({ amount, assetId });
        });
        it("should call defaultAddress.fund with correct parameters when passing in bigint amount", async () => {
            const amount = BigInt(1);
            const assetId = "eth";
            await wallet.fund({ amount, assetId });
            expect(defaultAddress.fund).toHaveBeenCalledWith({ amount, assetId });
        });
        it("should throw error if default address does not exist", async () => {
            jest
                .spyOn(wallet, "getDefaultAddress")
                .mockRejectedValue(new Error("Default address does not exist"));
            const amount = new decimal_js_1.Decimal("1.0");
            const assetId = "eth";
            await expect(wallet.fund({ amount, assetId })).rejects.toThrow("Default address does not exist");
        });
    });
    describe("#quoteFund", () => {
        it("should call defaultAddress.quoteFund with correct parameters when passing in decimal amount", async () => {
            const amount = new decimal_js_1.Decimal("1.0");
            const assetId = "eth";
            await wallet.quoteFund({ amount, assetId });
            expect(defaultAddress.quoteFund).toHaveBeenCalledWith({ amount, assetId });
        });
        it("should call defaultAddress.quoteFund with correct parameters when passing in number amount", async () => {
            const amount = 1;
            const assetId = "eth";
            await wallet.quoteFund({ amount, assetId });
            expect(defaultAddress.quoteFund).toHaveBeenCalledWith({ amount, assetId });
        });
        it("should call defaultAddress.quoteFund with correct parameters when passing in bigint amount", async () => {
            const amount = BigInt(1);
            const assetId = "eth";
            await wallet.quoteFund({ amount, assetId });
            expect(defaultAddress.quoteFund).toHaveBeenCalledWith({ amount, assetId });
        });
        it("should throw error if default address does not exist", async () => {
            jest
                .spyOn(wallet, "getDefaultAddress")
                .mockRejectedValue(new Error("Default address does not exist"));
            const amount = new decimal_js_1.Decimal("1.0");
            const assetId = "eth";
            await expect(wallet.quoteFund({ amount, assetId })).rejects.toThrow("Default address does not exist");
        });
    });
    describe("#listFundOperations", () => {
        it("should call defaultAddress.listFundOperations with correct parameters", async () => {
            await wallet.listFundOperations({
                limit: 10,
                page: "test-page",
            });
            expect(defaultAddress.listFundOperations).toHaveBeenCalledWith({
                limit: 10,
                page: "test-page",
            });
        });
    });
});
