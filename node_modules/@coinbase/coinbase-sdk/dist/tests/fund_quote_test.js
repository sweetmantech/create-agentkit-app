"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fund_quote_1 = require("../coinbase/fund_quote");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const asset_1 = require("../coinbase/asset");
const decimal_js_1 = __importDefault(require("decimal.js"));
const crypto_amount_1 = require("../coinbase/crypto_amount");
const fund_operation_1 = require("../coinbase/fund_operation");
describe("FundQuote", () => {
    let assetModel;
    let asset;
    let fundQuoteModel;
    let fundQuote;
    beforeEach(() => {
        coinbase_1.Coinbase.apiClients.asset = utils_1.assetApiMock;
        coinbase_1.Coinbase.apiClients.fund = utils_1.fundOperationsApiMock;
        assetModel = utils_1.VALID_ASSET_MODEL;
        asset = asset_1.Asset.fromModel(assetModel);
        fundQuoteModel = utils_1.VALID_FUND_QUOTE_MODEL;
        fundQuote = fund_quote_1.FundQuote.fromModel(fundQuoteModel);
        coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.mockReturnValue)(assetModel);
        coinbase_1.Coinbase.apiClients.fund.createFundQuote = (0, utils_1.mockReturnValue)(fundQuoteModel);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("constructor", () => {
        it("should initialize a FundQuote object", () => {
            expect(fundQuote).toBeInstanceOf(fund_quote_1.FundQuote);
        });
    });
    describe(".create", () => {
        it("should create a new fund quote", async () => {
            const newFundQuote = await fund_quote_1.FundQuote.create(fundQuoteModel.wallet_id, fundQuoteModel.address_id, new decimal_js_1.default(fundQuoteModel.crypto_amount.amount), fundQuoteModel.crypto_amount.asset.asset_id, fundQuoteModel.network_id);
            expect(newFundQuote).toBeInstanceOf(fund_quote_1.FundQuote);
            expect(coinbase_1.Coinbase.apiClients.asset.getAsset).toHaveBeenCalledWith(fundQuoteModel.network_id, fundQuoteModel.crypto_amount.asset.asset_id);
            expect(coinbase_1.Coinbase.apiClients.fund.createFundQuote).toHaveBeenCalledWith(fundQuoteModel.wallet_id, fundQuoteModel.address_id, {
                asset_id: asset_1.Asset.primaryDenomination(fundQuoteModel.crypto_amount.asset.asset_id),
                amount: asset.toAtomicAmount(new decimal_js_1.default(fundQuoteModel.crypto_amount.amount)).toString(),
            });
        });
    });
    describe("#getId", () => {
        it("should return the fund quote ID", () => {
            expect(fundQuote.getId()).toEqual(fundQuoteModel.fund_quote_id);
        });
    });
    describe("#getNetworkId", () => {
        it("should return the network ID", () => {
            expect(fundQuote.getNetworkId()).toEqual(fundQuoteModel.network_id);
        });
    });
    describe("#getWalletId", () => {
        it("should return the wallet ID", () => {
            expect(fundQuote.getWalletId()).toEqual(fundQuoteModel.wallet_id);
        });
    });
    describe("#getAddressId", () => {
        it("should return the address ID", () => {
            expect(fundQuote.getAddressId()).toEqual(fundQuoteModel.address_id);
        });
    });
    describe("#getAsset", () => {
        it("should return the asset", () => {
            expect(fundQuote.getAsset()).toEqual(asset);
        });
    });
    describe("#getAmount", () => {
        it("should return the crypto amount", () => {
            const cryptoAmount = fundQuote.getAmount();
            expect(cryptoAmount.getAmount()).toEqual(new decimal_js_1.default(fundQuoteModel.crypto_amount.amount).div(new decimal_js_1.default(10).pow(asset.decimals)));
            expect(cryptoAmount.getAsset()).toEqual(asset);
        });
    });
    describe("#getFiatAmount", () => {
        it("should return the fiat amount", () => {
            expect(fundQuote.getFiatAmount()).toEqual(new decimal_js_1.default(fundQuoteModel.fiat_amount.amount));
        });
    });
    describe("#getFiatCurrency", () => {
        it("should return the fiat currency", () => {
            expect(fundQuote.getFiatCurrency()).toEqual(fundQuoteModel.fiat_amount.currency);
        });
    });
    describe("#getBuyFee", () => {
        it("should return the buy fee", () => {
            expect(fundQuote.getBuyFee()).toEqual({
                amount: fundQuoteModel.fees.buy_fee.amount,
                currency: fundQuoteModel.fees.buy_fee.currency,
            });
        });
    });
    describe("#getTransferFee", () => {
        it("should return the transfer fee", () => {
            expect(fundQuote.getTransferFee()).toEqual(crypto_amount_1.CryptoAmount.fromModel(fundQuoteModel.fees.transfer_fee));
        });
    });
    describe("#execute", () => {
        it("should execute the fund quote and create a fund operation", async () => {
            coinbase_1.Coinbase.apiClients.fund.createFundOperation = (0, utils_1.mockReturnValue)(fundQuoteModel);
            const newFundOperation = await fundQuote.execute();
            expect(newFundOperation).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(coinbase_1.Coinbase.apiClients.fund.createFundOperation).toHaveBeenCalledWith(fundQuoteModel.wallet_id, fundQuoteModel.address_id, {
                asset_id: asset_1.Asset.primaryDenomination(fundQuoteModel.crypto_amount.asset.asset_id),
                amount: fundQuoteModel.crypto_amount.amount,
                fund_quote_id: fundQuoteModel.fund_quote_id,
            });
        });
    });
});
