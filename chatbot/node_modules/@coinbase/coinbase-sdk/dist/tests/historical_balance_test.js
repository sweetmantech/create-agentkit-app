"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const historical_balance_1 = require("../coinbase/historical_balance");
const decimal_js_1 = require("decimal.js");
const coinbase_1 = require("../coinbase/coinbase");
describe("HistoricalBalance", () => {
    describe("#fromModel", () => {
        const amount = new decimal_js_1.Decimal(1);
        const historyModel = {
            amount: "1000000000000000000",
            block_hash: "0x0dadd465fb063ceb78babbb30abbc6bfc0730d0c57a53e8f6dc778dafcea568f",
            block_height: "11349306",
            asset: {
                asset_id: coinbase_1.Coinbase.assets.Eth,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
        };
        const historicalBalance = historical_balance_1.HistoricalBalance.fromModel(historyModel);
        it("returns a new HistoricalBalance object with the correct amount", () => {
            expect(historicalBalance.amount).toEqual(amount);
        });
        it("returns a new HistoricalBalance object with the correct asset_id", () => {
            expect(historicalBalance.asset.assetId).toBe(coinbase_1.Coinbase.assets.Eth);
        });
    });
});
