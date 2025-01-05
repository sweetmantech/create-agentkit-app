"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const client_1 = require("../client");
const decimal_js_1 = __importDefault(require("decimal.js"));
const external_address_1 = require("../coinbase/address/external_address");
const types_1 = require("../coinbase/types");
const staking_operation_1 = require("../coinbase/staking_operation");
const asset_1 = require("../coinbase/asset");
const crypto_1 = require("crypto");
describe("ExternalAddress", () => {
    const newAddress = (0, utils_1.newAddressModel)("", (0, crypto_1.randomUUID)(), coinbase_1.Coinbase.networks.EthereumHolesky);
    const address = new external_address_1.ExternalAddress(newAddress.network_id, newAddress.address_id);
    const STAKING_CONTEXT_MODEL = {
        context: {
            stakeable_balance: {
                amount: "3000000000000000000",
                asset: {
                    asset_id: coinbase_1.Coinbase.assets.Eth,
                    network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
                    decimals: 18,
                    contract_address: "0x",
                },
            },
            unstakeable_balance: {
                amount: "2000000000000000000",
                asset: {
                    asset_id: coinbase_1.Coinbase.assets.Eth,
                    network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
                    decimals: 18,
                    contract_address: "0x",
                },
            },
            claimable_balance: {
                amount: "1000000000000000000",
                asset: {
                    asset_id: coinbase_1.Coinbase.assets.Eth,
                    network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
                    decimals: 18,
                    contract_address: "0x",
                },
            },
        },
    };
    const STAKING_OPERATION_MODEL = {
        id: (0, crypto_1.randomUUID)(),
        network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
        address_id: "0x1234567890",
        status: client_1.StakingOperationStatusEnum.Initialized,
        transactions: [
            {
                from_address_id: address.getId(),
                network_id: address.getNetworkId(),
                status: "pending",
                unsigned_payload: "7b2274797065223a22307832222c22636861696e4964223a22307834323638222c226e6f" +
                    "6e6365223a2230783137222c22746f223a22307861353534313664653564653631613061" +
                    "633161613839373061323830653034333838623164653462222c22676173223a22307833" +
                    "30643430222c226761735072696365223a6e756c6c2c226d61785072696f726974794665" +
                    "65506572476173223a223078323534306265343030222c226d6178466565506572476173" +
                    "223a223078326437313162383430222c2276616c7565223a223078356166333130376134" +
                    "303030222c22696e707574223a2230783361346236366631222c226163636573734c6973" +
                    "74223a5b5d2c2276223a22307830222c2272223a22307830222c2273223a22307830222c" +
                    "2279506172697479223a22307830222c2268617368223a22307839613034353830343332" +
                    "646630666334656139646164653561343836353433623831666239333833316430646239" +
                    "386263356436373834393339343866333432227d",
            },
        ],
    };
    const startTime = "2024-05-01T00:00:00Z";
    const endTime = "2024-05-21T00:00:00Z";
    const STAKING_REWARD_RESPONSE = {
        data: [
            {
                address_id: address.getId(),
                date: "2024-05-01",
                amount: "361",
                state: client_1.StakingRewardStateEnum.Pending,
                format: client_1.StakingRewardFormat.Usd,
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
                format: client_1.StakingRewardFormat.Usd,
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
                format: client_1.StakingRewardFormat.Usd,
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
    const HISTORICAL_STAKING_BALANCES_RESPONSE = {
        data: [
            {
                address: address.getId(),
                date: "2024-05-01",
                bonded_stake: {
                    amount: "32",
                    asset: {
                        asset_id: coinbase_1.Coinbase.assets.Eth,
                        network_id: address.getNetworkId(),
                        decimals: 18,
                    },
                },
                unbonded_balance: {
                    amount: "2",
                    asset: {
                        asset_id: coinbase_1.Coinbase.assets.Eth,
                        network_id: address.getNetworkId(),
                        decimals: 18,
                    },
                },
                participant_type: "validator",
            },
            {
                address: address.getId(),
                date: "2024-05-02",
                bonded_stake: {
                    amount: "33",
                    asset: {
                        asset_id: coinbase_1.Coinbase.assets.Eth,
                        network_id: address.getNetworkId(),
                        decimals: 18,
                    },
                },
                unbonded_balance: {
                    amount: "3",
                    asset: {
                        asset_id: coinbase_1.Coinbase.assets.Eth,
                        network_id: address.getNetworkId(),
                        decimals: 18,
                    },
                },
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
    describe("#buildStakeOperation", () => {
        it("should successfully build a stake operation", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            coinbase_1.Coinbase.apiClients.stake.buildStakingOperation = (0, utils_1.mockReturnValue)(STAKING_OPERATION_MODEL);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const op = await address.buildStakeOperation(new decimal_js_1.default("0.0001"), coinbase_1.Coinbase.assets.Eth, types_1.StakeOptionsMode.PARTIAL);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.PARTIAL,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                action: "stake",
                options: {
                    mode: types_1.StakeOptionsMode.PARTIAL,
                    amount: "100000000000000",
                },
            });
            expect(op).toBeInstanceOf(staking_operation_1.StakingOperation);
        });
        it("should return an error for not enough amount to stake", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            await expect(address.buildStakeOperation(new decimal_js_1.default("3.1"), coinbase_1.Coinbase.assets.Eth)).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledTimes(0);
        });
        it("should return an error for trying to stake less than or equal to zero", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            coinbase_1.Coinbase.apiClients.stake.buildStakingOperation = (0, utils_1.mockReturnValue)(STAKING_OPERATION_MODEL);
            await expect(address.buildStakeOperation(new decimal_js_1.default("0"), coinbase_1.Coinbase.assets.Eth)).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledTimes(0);
        });
    });
    describe("#buildUnstakeOperation", () => {
        it("should successfully build a unstake operation", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            coinbase_1.Coinbase.apiClients.stake.buildStakingOperation = (0, utils_1.mockReturnValue)(STAKING_OPERATION_MODEL);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const op = await address.buildUnstakeOperation(new decimal_js_1.default("0.0001"), coinbase_1.Coinbase.assets.Eth);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                action: "unstake",
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                    amount: "100000000000000",
                },
            });
            expect(op).toBeInstanceOf(staking_operation_1.StakingOperation);
        });
        it("should return an error for not enough amount to unstake", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            await expect(address.buildUnstakeOperation(new decimal_js_1.default("2.1"), coinbase_1.Coinbase.assets.Eth)).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledTimes(0);
        });
        it("should return an error for trying to unstake less than or equal to zero", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            coinbase_1.Coinbase.apiClients.stake.buildStakingOperation = (0, utils_1.mockReturnValue)(STAKING_OPERATION_MODEL);
            await expect(address.buildUnstakeOperation(new decimal_js_1.default("0"), coinbase_1.Coinbase.assets.Eth)).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledTimes(0);
        });
    });
    describe("#buildClaimStakeOperation", () => {
        it("should successfully build a claim stake operation", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            coinbase_1.Coinbase.apiClients.stake.buildStakingOperation = (0, utils_1.mockReturnValue)(STAKING_OPERATION_MODEL);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const op = await address.buildClaimStakeOperation(new decimal_js_1.default("0.0001"), coinbase_1.Coinbase.assets.Eth);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                action: "claim_stake",
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                    amount: "100000000000000",
                },
            });
            expect(op).toBeInstanceOf(staking_operation_1.StakingOperation);
        });
        it("should return an error for not enough amount to claim stake", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            await expect(address.buildClaimStakeOperation(new decimal_js_1.default("1.1"), coinbase_1.Coinbase.assets.Eth)).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledTimes(0);
        });
        it("should return an error for trying to claim stake less than or equal to zero", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            coinbase_1.Coinbase.apiClients.stake.buildStakingOperation = (0, utils_1.mockReturnValue)(STAKING_OPERATION_MODEL);
            await expect(address.buildClaimStakeOperation(new decimal_js_1.default("0"), coinbase_1.Coinbase.assets.Eth)).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
            expect(coinbase_1.Coinbase.apiClients.stake.buildStakingOperation).toHaveBeenCalledTimes(0);
        });
        it("should return an error for trying to claim stake for native eth", async () => {
            await expect(address.buildClaimStakeOperation(new decimal_js_1.default("0"), coinbase_1.Coinbase.assets.Eth, types_1.StakeOptionsMode.NATIVE)).rejects.toThrow(Error);
        });
    });
    describe("#stakingRewards", () => {
        it("should return staking rewards successfully", async () => {
            coinbase_1.Coinbase.apiClients.stake.fetchStakingRewards = (0, utils_1.mockReturnValue)(STAKING_REWARD_RESPONSE);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const response = await address.stakingRewards(coinbase_1.Coinbase.assets.Eth, startTime, endTime);
            expect(response).toBeInstanceOf((Array));
            expect(response.length).toEqual(3);
            expect(coinbase_1.Coinbase.apiClients.stake.fetchStakingRewards).toHaveBeenCalledWith({
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                address_ids: [address.getId()],
                start_time: startTime,
                end_time: endTime,
                format: client_1.StakingRewardFormat.Usd,
            }, 100, undefined);
        });
    });
    describe("#historicalStakingBalances", () => {
        it("should return staking balances successfully", async () => {
            coinbase_1.Coinbase.apiClients.stake.fetchHistoricalStakingBalances = (0, utils_1.mockReturnValue)(HISTORICAL_STAKING_BALANCES_RESPONSE);
            coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.getAssetMock)();
            const response = await address.historicalStakingBalances(coinbase_1.Coinbase.assets.Eth, startTime, endTime);
            expect(response).toBeInstanceOf((Array));
            expect(response.length).toEqual(2);
            expect(coinbase_1.Coinbase.apiClients.stake.fetchHistoricalStakingBalances).toHaveBeenCalledWith(address.getNetworkId(), coinbase_1.Coinbase.assets.Eth, address.getId(), startTime, endTime, 100, undefined);
        });
    });
    describe("#listBalances", () => {
        beforeEach(() => {
            const mockBalanceResponse = {
                data: [
                    {
                        amount: "1000000000000000000",
                        asset: {
                            asset_id: coinbase_1.Coinbase.assets.Eth,
                            network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
                            decimals: 18,
                        },
                    },
                    {
                        amount: "5000000",
                        asset: {
                            asset_id: "usdc",
                            network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
                            decimals: 6,
                        },
                    },
                ],
                has_more: false,
                next_page: "",
                total_count: 2,
            };
            coinbase_1.Coinbase.apiClients.externalAddress = utils_1.externalAddressApiMock;
            coinbase_1.Coinbase.apiClients.externalAddress.listExternalAddressBalances =
                (0, utils_1.mockReturnValue)(mockBalanceResponse);
        });
        it("should return 0 balance if no balances", async () => {
            coinbase_1.Coinbase.apiClients.externalAddress.listExternalAddressBalances = (0, utils_1.mockReturnValue)({
                data: [],
                has_more: false,
                next_page: "",
                total_count: 0,
            });
            const balanceMap = await address.listBalances();
            expect(balanceMap.size).toEqual(0);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.listExternalAddressBalances).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.listExternalAddressBalances).toHaveBeenCalledWith(address.getNetworkId(), address.getId());
        });
        it("should return results with an ETH and USDC balance", async () => {
            const balanceMap = await address.listBalances();
            expect(balanceMap.get("eth")).toEqual(new decimal_js_1.default(1));
            expect(balanceMap.get("usdc")).toEqual(new decimal_js_1.default(5));
            expect(coinbase_1.Coinbase.apiClients.externalAddress.listExternalAddressBalances).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.listExternalAddressBalances).toHaveBeenCalledWith(address.getNetworkId(), address.getId());
        });
    });
    describe("#getBalance", () => {
        beforeEach(() => {
            const mockWalletBalance = {
                amount: "5000000000000000000",
                asset: {
                    asset_id: coinbase_1.Coinbase.assets.Eth,
                    network_id: coinbase_1.Coinbase.networks.EthereumHolesky,
                    decimals: 18,
                },
            };
            coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance =
                (0, utils_1.mockReturnValue)(mockWalletBalance);
        });
        it("should return the correct ETH balance", async () => {
            const balanceMap = await address.getBalance(coinbase_1.Coinbase.assets.Eth);
            expect(balanceMap).toEqual(new decimal_js_1.default(5));
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledWith(address.getNetworkId(), address.getId(), asset_1.Asset.primaryDenomination(coinbase_1.Coinbase.assets.Eth));
        });
        it("should return the correct GWEI balance", async () => {
            const balance = await address.getBalance(coinbase_1.Coinbase.assets.Gwei);
            expect(balance).toEqual(new decimal_js_1.default(5000000000));
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledWith(address.getNetworkId(), address.getId(), coinbase_1.Coinbase.assets.Eth);
        });
        it("should return the correct WEI balance", async () => {
            const balance = await address.getBalance(coinbase_1.Coinbase.assets.Wei);
            expect(balance).toEqual(new decimal_js_1.default(5000000000000000000));
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledWith(address.getNetworkId(), address.getId(), coinbase_1.Coinbase.assets.Eth);
        });
        it("should return 0 when the balance is not found", async () => {
            coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance = (0, utils_1.mockReturnValue)(null);
            const balance = await address.getBalance(coinbase_1.Coinbase.assets.Wei);
            expect(balance).toEqual(new decimal_js_1.default(0));
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.getExternalAddressBalance).toHaveBeenCalledWith(address.getNetworkId(), address.getId(), coinbase_1.Coinbase.assets.Eth);
        });
    });
    describe("#faucet", () => {
        beforeEach(() => {
            coinbase_1.Coinbase.apiClients.externalAddress.requestExternalFaucetFunds = (0, utils_1.mockReturnValue)(utils_1.VALID_FAUCET_TRANSACTION_MODEL);
        });
        it("should successfully request funds from the faucet", async () => {
            const faucetTx = await address.faucet();
            const { transaction_hash: txHash, transaction_link: txLink } = utils_1.VALID_FAUCET_TRANSACTION_MODEL.transaction;
            expect(faucetTx.getTransactionHash()).toEqual(txHash);
            expect(faucetTx.getTransactionLink()).toEqual(txLink);
            expect(coinbase_1.Coinbase.apiClients.externalAddress.requestExternalFaucetFunds).toHaveBeenCalledWith(address.getNetworkId(), address.getId(), undefined, true);
        });
        it("should throw an error if the faucet request fails", async () => {
            coinbase_1.Coinbase.apiClients.externalAddress.requestExternalFaucetFunds = (0, utils_1.mockReturnValue)(null);
            await expect(address.faucet()).rejects.toThrow(Error);
        });
    });
    describe("#stakeableBalance", () => {
        it("should return the stakeable balance successfully with default params", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            const stakeableBalance = await address.stakeableBalance(coinbase_1.Coinbase.assets.Eth);
            expect(stakeableBalance).toEqual(new decimal_js_1.default("3"));
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
        });
        it("should return the stakeable balance successfully in DEFAULT/PARTIAL mode", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            const stakeableBalance = await address.stakeableBalance(coinbase_1.Coinbase.assets.Eth, types_1.StakeOptionsMode.PARTIAL, {});
            expect(stakeableBalance).toEqual(new decimal_js_1.default("3"));
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.PARTIAL,
                },
            });
        });
    });
    describe("#unstakeableBalance", () => {
        it("should return the unstakeable balance successfully with default params", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            const unstakeableBalance = await address.unstakeableBalance(coinbase_1.Coinbase.assets.Eth);
            expect(unstakeableBalance).toEqual(new decimal_js_1.default("2"));
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
        });
        it("should return the unstakeable balance successfully in DEFAULT/PARTIAL mode", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            const unstakeableBalance = await address.unstakeableBalance(coinbase_1.Coinbase.assets.Eth, types_1.StakeOptionsMode.PARTIAL, {});
            expect(unstakeableBalance).toEqual(new decimal_js_1.default("2"));
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.PARTIAL,
                },
            });
        });
    });
    describe("#claimableBalance", () => {
        it("should return the claimable balance successfully with default params", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            const claimableBalance = await address.claimableBalance(coinbase_1.Coinbase.assets.Eth);
            expect(claimableBalance).toEqual(new decimal_js_1.default("1"));
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
        });
        it("should return the claimable balance successfully in DEFAULT/PARTIAL mode", async () => {
            coinbase_1.Coinbase.apiClients.stake.getStakingContext = (0, utils_1.mockReturnValue)(STAKING_CONTEXT_MODEL);
            const claimableBalance = await address.claimableBalance(coinbase_1.Coinbase.assets.Eth, types_1.StakeOptionsMode.DEFAULT, {});
            expect(claimableBalance).toEqual(new decimal_js_1.default("1"));
            expect(coinbase_1.Coinbase.apiClients.stake.getStakingContext).toHaveBeenCalledWith({
                address_id: address.getId(),
                network_id: address.getNetworkId(),
                asset_id: coinbase_1.Coinbase.assets.Eth,
                options: {
                    mode: types_1.StakeOptionsMode.DEFAULT,
                },
            });
        });
    });
});
