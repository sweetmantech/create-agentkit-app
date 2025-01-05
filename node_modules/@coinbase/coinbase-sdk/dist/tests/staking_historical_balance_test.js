"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const staking_balance_1 = require("../coinbase/staking_balance");
const external_address_1 = require("../coinbase/address/external_address");
describe("StakingBalance", () => {
    const startTime = "2024-05-01T00:00:00Z";
    const endTime = "2024-05-21T00:00:00Z";
    const newAddress = (0, utils_1.newAddressModel)("", "some-address-id", coinbase_1.Coinbase.networks.EthereumHolesky);
    const address = new external_address_1.ExternalAddress(newAddress.network_id, newAddress.address_id);
    const asset = {
        asset_id: coinbase_1.Coinbase.assets.Eth,
        network_id: address.getNetworkId(),
        decimals: 18,
    };
    const bondedStake = {
        amount: "32000000000000000000",
        asset: asset,
    };
    const unbondedBalance = {
        amount: "2000000000000000000",
        asset: asset,
    };
    const HISTORICAL_STAKING_BALANCES_RESPONSE = {
        data: [
            {
                address: address.getId(),
                date: "2024-05-01",
                bonded_stake: bondedStake,
                unbonded_balance: unbondedBalance,
                participant_type: "validator",
            },
            {
                address: address.getId(),
                date: "2024-05-02",
                bonded_stake: bondedStake,
                unbonded_balance: unbondedBalance,
                participant_type: "validator",
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
    describe("#list", () => {
        it("should successfully return staking balances", async () => {
            coinbase_1.Coinbase.apiClients.stake.fetchHistoricalStakingBalances = (0, utils_1.mockReturnValue)(HISTORICAL_STAKING_BALANCES_RESPONSE);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const response = await staking_balance_1.StakingBalance.list(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, address.getId(), startTime, endTime);
            expect(response).toBeInstanceOf((Array));
            expect(response.length).toEqual(2);
            expect(coinbase_1.Coinbase.apiClients.stake.fetchHistoricalStakingBalances).toHaveBeenCalledWith(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, address.getId(), startTime, endTime, 100, undefined);
        });
        it("should successfully return staking balances for multiple pages", async () => {
            const pages = ["abc", "def"];
            coinbase_1.Coinbase.apiClients.stake.fetchHistoricalStakingBalances = (0, utils_1.mockFn)(() => {
                HISTORICAL_STAKING_BALANCES_RESPONSE.next_page = pages.shift();
                HISTORICAL_STAKING_BALANCES_RESPONSE.has_more =
                    !!HISTORICAL_STAKING_BALANCES_RESPONSE.next_page;
                return { data: HISTORICAL_STAKING_BALANCES_RESPONSE };
            });
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const response = await staking_balance_1.StakingBalance.list(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, address.getId(), startTime, endTime);
            expect(response).toBeInstanceOf((Array));
            expect(response.length).toEqual(6);
            expect(coinbase_1.Coinbase.apiClients.stake.fetchHistoricalStakingBalances).toHaveBeenCalledWith(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, address.getId(), startTime, endTime, 100, undefined);
        });
    });
    describe(".date", () => {
        it("should return the correct date", () => {
            const balance = new staking_balance_1.StakingBalance({
                address: address.getId(),
                date: "2024-05-03",
                bonded_stake: bondedStake,
                unbonded_balance: unbondedBalance,
                participant_type: "validator",
            });
            const date = balance.date();
            expect(date).toEqual(new Date("2024-05-03"));
        });
    });
    describe(".toString", () => {
        it("should return the string representation of a staking balance", () => {
            const balance = new staking_balance_1.StakingBalance({
                address: address.getId(),
                date: "2024-05-03",
                bonded_stake: bondedStake,
                unbonded_balance: unbondedBalance,
                participant_type: "validator",
            });
            const balanceStr = balance.toString();
            expect(balanceStr).toEqual("StakingBalance { date: '2024-05-03T00:00:00.000Z' address: 'some-address-id' bondedStake: '32 ETH' unbondedBalance: '2 ETH' participantType: 'validator' }");
        });
    });
    describe(".addressId", () => {
        it("should return the onchain address of the StakingBalance", () => {
            const balance = new staking_balance_1.StakingBalance({
                address: address.getId(),
                date: "2024-05-03",
                bonded_stake: bondedStake,
                unbonded_balance: unbondedBalance,
                participant_type: "validator",
            });
            const addressId = balance.address();
            expect(addressId).toEqual(address.getId());
        });
    });
});
