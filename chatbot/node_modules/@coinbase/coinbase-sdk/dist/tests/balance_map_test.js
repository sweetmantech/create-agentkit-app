"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const balance_map_1 = require("../coinbase/balance_map");
const balance_1 = require("../coinbase/balance");
const decimal_js_1 = require("decimal.js");
const coinbase_1 = require("../coinbase/coinbase");
describe("BalanceMap", () => {
    const ethAmount = new decimal_js_1.Decimal(1);
    const ethAtomicAmount = "1000000000000000000";
    const usdcAmount = new decimal_js_1.Decimal(2);
    const usdcAtomicAmount = "2000000";
    const wethAmount = new decimal_js_1.Decimal(3);
    const wethAtomicAmount = "3000000000000000000";
    describe(".fromBalances", () => {
        const ethBalanceModel = {
            asset: {
                asset_id: coinbase_1.Coinbase.assets.Eth,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
            amount: ethAtomicAmount,
        };
        const usdcBalanceModel = {
            asset: {
                asset_id: "usdc",
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 6,
                contract_address: "0x",
            },
            amount: usdcAtomicAmount,
        };
        const wethBalanceModel = {
            asset: {
                asset_id: "weth",
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
            amount: wethAtomicAmount,
        };
        const balances = [ethBalanceModel, usdcBalanceModel, wethBalanceModel];
        const balanceMap = balance_map_1.BalanceMap.fromBalances(balances);
        it("returns a new BalanceMap object with the correct balances", () => {
            expect(balanceMap.get(coinbase_1.Coinbase.assets.Eth)).toEqual(ethAmount);
            expect(balanceMap.get("usdc")).toEqual(usdcAmount);
            expect(balanceMap.get("weth")).toEqual(wethAmount);
        });
    });
    describe(".add", () => {
        const assetId = coinbase_1.Coinbase.assets.Eth;
        const balance = balance_1.Balance.fromModelAndAssetId({
            amount: ethAtomicAmount,
            asset: {
                asset_id: assetId,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
        }, assetId);
        const balanceMap = new balance_map_1.BalanceMap();
        it("sets the amount", () => {
            balanceMap.add(balance);
            expect(balanceMap.get(assetId)).toEqual(ethAmount);
        });
        it("throws an error if the balance parameter is not instance of Balance", () => {
            expect(() => balanceMap.add(null)).toThrow(Error);
        });
    });
    describe(".toString", () => {
        const assetId = coinbase_1.Coinbase.assets.Eth;
        const balance = balance_1.Balance.fromModelAndAssetId({
            amount: ethAtomicAmount,
            asset: {
                asset_id: assetId,
                network_id: coinbase_1.Coinbase.networks.BaseSepolia,
                decimals: 18,
                contract_address: "0x",
            },
        }, assetId);
        const balanceMap = new balance_map_1.BalanceMap();
        balanceMap.add(balance);
        it("returns a string representation of asset_id to floating-point number", () => {
            expect(balanceMap.toString()).toBe(`BalanceMap{"${assetId}":"${ethAmount}"}`);
        });
    });
});
