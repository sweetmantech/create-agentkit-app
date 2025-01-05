"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const balance_1 = require("../coinbase/balance");
const decimal_js_1 = require("decimal.js");
const coinbase_1 = require("../coinbase/coinbase");
describe("Balance", () => {
    describe(".fromModel", () => {
        const amount = new decimal_js_1.Decimal(1);
        const balanceModel = {
            amount: "1000000000000000000",
            asset: {
                asset_id: coinbase_1.Coinbase.assets.Eth,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
        };
        const balance = balance_1.Balance.fromModel(balanceModel);
        it("returns a new Balance object with the correct amount", () => {
            expect(balance.amount).toEqual(amount);
        });
        it("returns a new Balance object with the correct asset_id", () => {
            expect(balance.assetId).toBe(coinbase_1.Coinbase.assets.Eth);
        });
    });
    describe(".fromModelAndAssetId", () => {
        const amount = new decimal_js_1.Decimal(1);
        const balanceModel = {
            asset: {
                asset_id: coinbase_1.Coinbase.assets.Eth,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
            amount: "1000000000000000000",
        };
        const balance = balance_1.Balance.fromModelAndAssetId(balanceModel, coinbase_1.Coinbase.assets.Eth);
        it("returns a new Balance object with the correct amount", () => {
            expect(balance.amount).toEqual(amount);
        });
        it("returns a new Balance object with the correct asset_id", () => {
            expect(balance.assetId).toBe(coinbase_1.Coinbase.assets.Eth);
        });
    });
});
