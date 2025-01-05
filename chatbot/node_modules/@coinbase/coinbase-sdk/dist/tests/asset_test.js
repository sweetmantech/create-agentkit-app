"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
const coinbase_1 = require("../coinbase/coinbase");
const constants_1 = require("../coinbase/constants");
const asset_1 = require("./../coinbase/asset");
describe("Asset", () => {
    describe(".fromModel", () => {
        it("should return an Asset object", () => {
            const model = {
                asset_id: coinbase_1.Coinbase.assets.Eth,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                contract_address: "0x",
                decimals: 18,
            };
            const asset = asset_1.Asset.fromModel(model);
            expect(asset).toBeInstanceOf(asset_1.Asset);
            expect(asset.getAssetId()).toEqual(coinbase_1.Coinbase.assets.Eth);
        });
        describe("when the model is invalid", () => {
            it("should throw an error", () => {
                expect(() => asset_1.Asset.fromModel(null)).toThrow("Invalid asset model");
            });
        });
        describe("when the asset_id is gwei", () => {
            it("should set the decimals to 9 and assetId to gwei", () => {
                const model = {
                    asset_id: "eth",
                    network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                    contract_address: "0x",
                    decimals: 18,
                };
                const asset = asset_1.Asset.fromModel(model, coinbase_1.Coinbase.assets.Gwei);
                expect(asset.decimals).toEqual(constants_1.GWEI_DECIMALS);
                expect(asset.getAssetId()).toEqual("gwei");
            });
        });
        describe("when the asset_id is wei", () => {
            it("should set the decimals to 0 and assetId to wei", () => {
                const model = {
                    asset_id: "eth",
                    network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                    contract_address: "0x",
                    decimals: 18,
                };
                const asset = asset_1.Asset.fromModel(model, coinbase_1.Coinbase.assets.Wei);
                expect(asset.decimals).toEqual(0);
                expect(asset.getAssetId()).toEqual("wei");
            });
        });
    });
    describe("#toString", () => {
        it("should return the assetId", () => {
            const asset = asset_1.Asset.fromModel({
                asset_id: "eth",
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                contract_address: "contractAddress",
                decimals: 18,
            });
            expect(asset.toString()).toEqual(`Asset{ networkId: base-sepolia, assetId: eth, contractAddress: contractAddress, decimals: 18 }`);
        });
    });
    describe(".primaryDenomination", () => {
        ["wei", "gwei"].forEach(assetId => {
            describe(`when the assetId is ${assetId}`, () => {
                it("should return 'eth'", () => {
                    expect(asset_1.Asset.primaryDenomination(assetId)).toEqual("eth");
                });
            });
        });
        describe("when the assetId is not wei or gwei", () => {
            it("should return the assetId", () => {
                expect(asset_1.Asset.primaryDenomination("other")).toEqual("other");
            });
        });
    });
    describe("#toAtomicAmount", () => {
        it("should return the atomic amount", () => {
            const asset = asset_1.Asset.fromModel({
                asset_id: "eth",
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                contract_address: "contractAddress",
                decimals: 18,
            });
            const atomicAmount = asset.toAtomicAmount(new decimal_js_1.default(1.23));
            expect(atomicAmount).toEqual(BigInt(1230000000000000000));
        });
        it("should handle large numbers without using scientific notation", () => {
            const asset = asset_1.Asset.fromModel({
                asset_id: "eth",
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                contract_address: "contractAddress",
                decimals: 18,
            });
            const atomicAmount = asset.toAtomicAmount(new decimal_js_1.default(2000));
            expect(atomicAmount).toEqual(BigInt(2000000000000000000000));
            expect(atomicAmount.toString()).not.toContain("e");
        });
    });
});
