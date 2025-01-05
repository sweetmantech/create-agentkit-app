"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../client");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const types_1 = require("../coinbase/types");
const staking_reward_1 = require("../coinbase/staking_reward");
const external_address_1 = require("../coinbase/address/external_address");
const asset_1 = require("../coinbase/asset");
const decimal_js_1 = __importDefault(require("decimal.js"));
describe("StakingReward", () => {
    const startTime = "2024-05-01T00:00:00Z";
    const endTime = "2024-05-21T00:00:00Z";
    const newAddress = (0, utils_1.newAddressModel)("", "some-address-id", coinbase_1.Coinbase.networks.EthereumHolesky);
    const address = new external_address_1.ExternalAddress(newAddress.network_id, newAddress.address_id);
    const asset = asset_1.Asset.fromModel({
        asset_id: coinbase_1.Coinbase.assets.Eth,
        network_id: address.getNetworkId(),
        contract_address: "0x",
        decimals: 18,
    });
    const STAKING_REWARD_RESPONSE = {
        data: [
            {
                address_id: address.getId(),
                date: "2024-05-01",
                amount: "361",
                state: client_1.StakingRewardStateEnum.Pending,
                format: "usd",
                usd_value: {
                    amount: "361",
                    conversion_price: "3000",
                    conversion_time: "2024-05-01T00:00:00Z",
                },
            },
            {
                address_id: address.getId(),
                date: "2024-05-02",
                amount: "203",
                state: client_1.StakingRewardStateEnum.Pending,
                format: "usd",
                usd_value: {
                    amount: "203",
                    conversion_price: "3000",
                    conversion_time: "2024-05-02T00:00:00Z",
                },
            },
            {
                address_id: address.getId(),
                date: "2024-05-03",
                amount: "226",
                state: client_1.StakingRewardStateEnum.Pending,
                format: "usd",
                usd_value: {
                    amount: "226",
                    conversion_price: "3000",
                    conversion_time: "2024-05-03T00:00:00Z",
                },
            },
        ],
        has_more: false,
        next_page: "",
    };
    beforeAll(() => {
        coinbase_1.Coinbase.apiClients.stake = utils_1.stakeApiMock;
        coinbase_1.Coinbase.apiClients.asset = utils_1.assetsApiMock;
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe(".list", () => {
        it("should successfully return staking rewards", async () => {
            coinbase_1.Coinbase.apiClients.stake.fetchStakingRewards = (0, utils_1.mockReturnValue)(STAKING_REWARD_RESPONSE);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const response = await staking_reward_1.StakingReward.list(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, [address.getId()], startTime, endTime);
            expect(response).toBeInstanceOf((Array));
            expect(response.length).toEqual(3);
            expect(coinbase_1.Coinbase.apiClients.stake.fetchStakingRewards).toHaveBeenCalledWith({
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                address_ids: [address.getId()],
                start_time: startTime,
                end_time: endTime,
                format: types_1.StakingRewardFormat.USD,
            }, 100, undefined);
        });
        it("should successfully return staking rewards for multiple pages", async () => {
            const pages = ["abc", "def"];
            coinbase_1.Coinbase.apiClients.stake.fetchStakingRewards = (0, utils_1.mockFn)(() => {
                STAKING_REWARD_RESPONSE.next_page = pages.shift();
                STAKING_REWARD_RESPONSE.has_more = !!STAKING_REWARD_RESPONSE.next_page;
                return { data: STAKING_REWARD_RESPONSE };
            });
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const response = await staking_reward_1.StakingReward.list(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, [address.getId()], startTime, endTime);
            expect(response).toBeInstanceOf((Array));
            expect(response.length).toEqual(9);
            expect(coinbase_1.Coinbase.apiClients.stake.fetchStakingRewards).toHaveBeenCalledWith({
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                address_ids: [address.getId()],
                start_time: startTime,
                end_time: endTime,
                format: types_1.StakingRewardFormat.USD,
            }, 100, undefined);
        });
    });
    describe(".amount", () => {
        it("should return the correct amount for USD", () => {
            const reward = new staking_reward_1.StakingReward({
                address_id: address.getId(),
                date: "2024-05-02T00:00:00Z",
                amount: "226",
                state: client_1.StakingRewardStateEnum.Pending,
                format: types_1.StakingRewardFormat.USD,
                usd_value: {
                    amount: "226",
                    conversion_price: "3000",
                    conversion_time: "2024-05-03T00:00:00Z",
                },
            }, asset, types_1.StakingRewardFormat.USD);
            const amount = reward.amount();
            const usdValue = reward.usdValue();
            expect(amount).toEqual(new decimal_js_1.default("2.26"));
            expect(usdValue).toEqual(new decimal_js_1.default("2.26"));
        });
        it("should return the correct amount for native format", () => {
            const reward = new staking_reward_1.StakingReward({
                address_id: address.getId(),
                date: "2024-05-02T00:00:00Z",
                amount: "726030823305604",
                state: client_1.StakingRewardStateEnum.Pending,
                format: types_1.StakingRewardFormat.NATIVE,
                usd_value: {
                    amount: "179",
                    conversion_price: "2461.63",
                    conversion_time: "2024-05-02T00:00:00Z",
                },
            }, asset, types_1.StakingRewardFormat.NATIVE);
            const amount = reward.amount();
            expect(amount).toEqual(0.000726030823305604);
        });
        it("should return 0 when amount is empty", () => {
            const reward = new staking_reward_1.StakingReward({
                address_id: address.getId(),
                date: "2024-05-03",
                amount: "",
                state: client_1.StakingRewardStateEnum.Pending,
                format: types_1.StakingRewardFormat.NATIVE,
                usd_value: {
                    amount: "179",
                    conversion_price: "2461.63",
                    conversion_time: "2024-05-02T00:00:00Z",
                },
            }, asset, types_1.StakingRewardFormat.NATIVE);
            const amount = reward.amount();
            expect(amount).toEqual(0);
        });
    });
    describe(".date", () => {
        it("should return the correct date", () => {
            const reward = new staking_reward_1.StakingReward({
                address_id: address.getId(),
                date: "2024-05-03T01:23:45Z",
                amount: "226",
                state: client_1.StakingRewardStateEnum.Pending,
                format: types_1.StakingRewardFormat.USD,
                usd_value: {
                    amount: "226",
                    conversion_price: "3000",
                    conversion_time: "2024-05-03T00:00:00Z",
                },
            }, asset, types_1.StakingRewardFormat.USD);
            const date = reward.date();
            const conversionTime = reward.conversionTime();
            expect(date).toEqual(new Date("2024-05-03T01:23:45Z"));
            expect(conversionTime).toEqual(new Date("2024-05-03T00:00:00Z"));
        });
    });
    describe(".toString", () => {
        it("should return the string representation of a staking reward", () => {
            const reward = new staking_reward_1.StakingReward({
                address_id: address.getId(),
                date: "2024-05-03",
                amount: "226",
                state: client_1.StakingRewardStateEnum.Pending,
                format: types_1.StakingRewardFormat.USD,
                usd_value: {
                    amount: "226",
                    conversion_price: "3000",
                    conversion_time: "2024-05-03T00:00:00Z",
                },
            }, asset, types_1.StakingRewardFormat.USD);
            const rewardStr = reward.toString();
            expect(rewardStr).toEqual("StakingReward { date: '2024-05-03T00:00:00.000Z' address: 'some-address-id' amount: '2.26' usd_value: '2.26' conversion_price: '3000' conversion_time: '2024-05-03T00:00:00.000Z' }");
        });
    });
    describe(".addressId", () => {
        it("should return the onchain address of the StakingReward", () => {
            const reward = new staking_reward_1.StakingReward({
                address_id: address.getId(),
                date: "2024-05-03",
                amount: "226",
                state: client_1.StakingRewardStateEnum.Pending,
                format: types_1.StakingRewardFormat.USD,
                usd_value: {
                    amount: "226",
                    conversion_price: "3000",
                    conversion_time: "2024-05-03T00:00:00Z",
                },
            }, asset, types_1.StakingRewardFormat.USD);
            const addressId = reward.addressId();
            expect(addressId).toEqual(address.getId());
        });
    });
});
