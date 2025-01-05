"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const decimal_js_1 = __importDefault(require("decimal.js"));
const crypto_amount_1 = require("../coinbase/crypto_amount");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
(0, globals_1.describe)("CryptoAmount", () => {
    let cryptoAmountModel;
    let cryptoAmount;
    beforeEach(() => {
        cryptoAmountModel = utils_1.VALID_USDC_CRYPTO_AMOUNT_MODEL;
        cryptoAmount = crypto_amount_1.CryptoAmount.fromModel(cryptoAmountModel);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    (0, globals_1.describe)(".fromModel", () => {
        (0, globals_1.it)("should correctly create CryptoAmount from model", () => {
            (0, globals_1.expect)(cryptoAmount).toBeInstanceOf(crypto_amount_1.CryptoAmount);
            (0, globals_1.expect)(cryptoAmount.getAmount().equals(new decimal_js_1.default(1).div(new decimal_js_1.default(10).pow(6))));
            (0, globals_1.expect)(cryptoAmount.getAsset().assetId).toEqual(coinbase_1.Coinbase.assets.Usdc);
            (0, globals_1.expect)(cryptoAmount.getAsset().networkId).toEqual("base-sepolia");
            (0, globals_1.expect)(cryptoAmount.getAsset().decimals).toEqual(6);
        });
    });
    (0, globals_1.describe)(".fromModelAndAssetId", () => {
        (0, globals_1.it)("should correctly create CryptoAmount from model with gwei denomination", () => {
            const cryptoAmount = crypto_amount_1.CryptoAmount.fromModelAndAssetId(utils_1.VALID_ETH_CRYPTO_AMOUNT_MODEL, coinbase_1.Coinbase.assets.Gwei);
            (0, globals_1.expect)(cryptoAmount.getAmount().equals(new decimal_js_1.default(1).div(new decimal_js_1.default(10).pow(9))));
            (0, globals_1.expect)(cryptoAmount.getAsset().assetId).toEqual(coinbase_1.Coinbase.assets.Gwei);
            (0, globals_1.expect)(cryptoAmount.getAsset().networkId).toEqual("base-sepolia");
            (0, globals_1.expect)(cryptoAmount.getAsset().decimals).toEqual(9);
        });
        (0, globals_1.it)("should correctly create CryptoAmount from model with wei denomination", () => {
            const cryptoAmount = crypto_amount_1.CryptoAmount.fromModelAndAssetId(utils_1.VALID_ETH_CRYPTO_AMOUNT_MODEL, coinbase_1.Coinbase.assets.Wei);
            (0, globals_1.expect)(cryptoAmount.getAmount().equals(new decimal_js_1.default(1)));
            (0, globals_1.expect)(cryptoAmount.getAsset().assetId).toEqual(coinbase_1.Coinbase.assets.Wei);
            (0, globals_1.expect)(cryptoAmount.getAsset().networkId).toEqual("base-sepolia");
            (0, globals_1.expect)(cryptoAmount.getAsset().decimals).toEqual(0);
        });
    });
    (0, globals_1.describe)("#getAmount", () => {
        (0, globals_1.it)("should return the correct amount", () => {
            (0, globals_1.expect)(cryptoAmount.getAmount().equals(new decimal_js_1.default(1).div(new decimal_js_1.default(10).pow(6))));
        });
    });
    (0, globals_1.describe)("#getAsset", () => {
        (0, globals_1.it)("should return the correct asset", () => {
            (0, globals_1.expect)(cryptoAmount.getAsset().assetId).toEqual(coinbase_1.Coinbase.assets.Usdc);
            (0, globals_1.expect)(cryptoAmount.getAsset().networkId).toEqual("base-sepolia");
            (0, globals_1.expect)(cryptoAmount.getAsset().decimals).toEqual(6);
        });
    });
    (0, globals_1.describe)("#getAssetId", () => {
        (0, globals_1.it)("should return the correct asset ID", () => {
            (0, globals_1.expect)(cryptoAmount.getAssetId()).toEqual(coinbase_1.Coinbase.assets.Usdc);
        });
    });
    (0, globals_1.describe)("#toAtomicAmount", () => {
        (0, globals_1.it)("should correctly convert to atomic amount", () => {
            (0, globals_1.expect)(cryptoAmount.toAtomicAmount().toString()).toEqual("1");
        });
    });
    (0, globals_1.describe)("#toString", () => {
        (0, globals_1.it)("should have correct string representation", () => {
            (0, globals_1.expect)(cryptoAmount.toString()).toEqual("CryptoAmount{amount: '0.000001', assetId: 'usdc'}");
        });
    });
});
