"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../client/api");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const asset_1 = require("../coinbase/asset");
const fund_operation_1 = require("../coinbase/fund_operation");
const decimal_js_1 = __importDefault(require("decimal.js"));
const fund_quote_1 = require("../coinbase/fund_quote");
const crypto_amount_1 = require("../coinbase/crypto_amount");
const errors_1 = require("../coinbase/errors");
const types_1 = require("../coinbase/types");
describe("FundOperation", () => {
    let assetModel;
    let asset;
    let fundOperationModel;
    let fundOperation;
    beforeEach(() => {
        coinbase_1.Coinbase.apiClients.asset = utils_1.assetApiMock;
        coinbase_1.Coinbase.apiClients.fund = utils_1.fundOperationsApiMock;
        assetModel = utils_1.VALID_ASSET_MODEL;
        asset = asset_1.Asset.fromModel(assetModel);
        fundOperationModel = utils_1.VALID_FUND_OPERATION_MODEL;
        fundOperation = fund_operation_1.FundOperation.fromModel(fundOperationModel);
        coinbase_1.Coinbase.apiClients.asset.getAsset = (0, utils_1.mockReturnValue)(assetModel);
        coinbase_1.Coinbase.apiClients.fund.createFundOperation = (0, utils_1.mockReturnValue)(fundOperationModel);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("constructor", () => {
        it("should initialize a FundOperation object", () => {
            expect(fundOperation).toBeInstanceOf(fund_operation_1.FundOperation);
        });
    });
    describe(".create", () => {
        it("should create a new fund operation without quote", async () => {
            const newFundOperation = await fund_operation_1.FundOperation.create(fundOperationModel.wallet_id, fundOperationModel.address_id, new decimal_js_1.default(fundOperationModel.crypto_amount.amount), fundOperationModel.crypto_amount.asset.asset_id, fundOperationModel.network_id);
            expect(newFundOperation).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(coinbase_1.Coinbase.apiClients.fund.createFundOperation).toHaveBeenCalledWith(fundOperationModel.wallet_id, fundOperationModel.address_id, {
                fund_quote_id: undefined,
                amount: new decimal_js_1.default(fundOperationModel.crypto_amount.amount)
                    .mul(10 ** asset.decimals)
                    .toString(),
                asset_id: fundOperationModel.crypto_amount.asset.asset_id,
            });
        });
        it("should create a new fund operation with quote", async () => {
            const newFundOperation = await fund_operation_1.FundOperation.create(fundOperationModel.wallet_id, fundOperationModel.address_id, new decimal_js_1.default(fundOperationModel.crypto_amount.amount), fundOperationModel.crypto_amount.asset.asset_id, fundOperationModel.network_id, fund_quote_1.FundQuote.fromModel(utils_1.VALID_FUND_QUOTE_MODEL));
            expect(newFundOperation).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(coinbase_1.Coinbase.apiClients.fund.createFundOperation).toHaveBeenCalledWith(fundOperationModel.wallet_id, fundOperationModel.address_id, {
                fund_quote_id: utils_1.VALID_FUND_QUOTE_MODEL.fund_quote_id,
                amount: new decimal_js_1.default(fundOperationModel.crypto_amount.amount)
                    .mul(10 ** asset.decimals)
                    .toString(),
                asset_id: fundOperationModel.crypto_amount.asset.asset_id,
            });
        });
    });
    describe(".listFundOperations", () => {
        it("should list fund operations", async () => {
            const response = {
                data: [utils_1.VALID_FUND_OPERATION_MODEL],
                has_more: false,
                next_page: "",
                total_count: 0,
            };
            coinbase_1.Coinbase.apiClients.fund.listFundOperations = (0, utils_1.mockReturnValue)(response);
            const paginationResponse = await fund_operation_1.FundOperation.listFundOperations(fundOperationModel.wallet_id, fundOperationModel.address_id);
            const fundOperations = paginationResponse.data;
            expect(fundOperations).toHaveLength(1);
            expect(fundOperations[0]).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(coinbase_1.Coinbase.apiClients.fund.listFundOperations).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.fund.listFundOperations).toHaveBeenCalledWith(fundOperationModel.wallet_id, fundOperationModel.address_id, 100, undefined);
        });
        it("should handle pagination", async () => {
            const response = {
                data: [utils_1.VALID_FUND_OPERATION_MODEL],
                has_more: true,
                next_page: "abc",
                total_count: 0,
            };
            coinbase_1.Coinbase.apiClients.fund.listFundOperations = (0, utils_1.mockReturnValue)(response);
            const paginationResponse = await fund_operation_1.FundOperation.listFundOperations(fundOperationModel.wallet_id, fundOperationModel.address_id);
            expect(paginationResponse.nextPage).toEqual("abc");
            expect(paginationResponse.hasMore).toEqual(true);
            const fundOperations = paginationResponse.data;
            expect(fundOperations).toHaveLength(1);
            expect(fundOperations[0]).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(coinbase_1.Coinbase.apiClients.fund.listFundOperations).toHaveBeenCalledTimes(1);
            expect(coinbase_1.Coinbase.apiClients.fund.listFundOperations).toHaveBeenCalledWith(fundOperationModel.wallet_id, fundOperationModel.address_id, 100, undefined);
        });
    });
    describe("#getId", () => {
        it("should return the fund operation ID", () => {
            expect(fundOperation.getId()).toEqual(fundOperationModel.fund_operation_id);
        });
    });
    describe("#getNetworkId", () => {
        it("should return the network ID", () => {
            expect(fundOperation.getNetworkId()).toEqual(fundOperationModel.network_id);
        });
    });
    describe("#getWalletId", () => {
        it("should return the wallet ID", () => {
            expect(fundOperation.getWalletId()).toEqual(fundOperationModel.wallet_id);
        });
    });
    describe("#getAddressId", () => {
        it("should return the address ID", () => {
            expect(fundOperation.getAddressId()).toEqual(fundOperationModel.address_id);
        });
    });
    describe("#getAsset", () => {
        it("should return the asset", () => {
            expect(fundOperation.getAsset()).toEqual(asset);
        });
    });
    describe("#getAmount", () => {
        it("should return the amount", () => {
            expect(fundOperation.getAmount()).toEqual(crypto_amount_1.CryptoAmount.fromModel(fundOperationModel.crypto_amount));
        });
    });
    describe("#getFiatAmount", () => {
        it("should return the fiat amount", () => {
            expect(fundOperation.getFiatAmount()).toEqual(new decimal_js_1.default(fundOperationModel.fiat_amount.amount));
        });
    });
    describe("#getFiatCurrency", () => {
        it("should return the fiat currency", () => {
            expect(fundOperation.getFiatCurrency()).toEqual(fundOperationModel.fiat_amount.currency);
        });
    });
    describe("#getStatus", () => {
        it("should return the current status", () => {
            expect(fundOperation.getStatus()).toEqual(fundOperationModel.status);
        });
    });
    describe("#reload", () => {
        it("should return PENDING when the fund operation has not been created", async () => {
            coinbase_1.Coinbase.apiClients.fund.getFundOperation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FUND_OPERATION_MODEL,
                status: api_1.FundOperationStatusEnum.Pending,
            });
            await fundOperation.reload();
            expect(fundOperation.getStatus()).toEqual(types_1.FundOperationStatus.PENDING);
            expect(coinbase_1.Coinbase.apiClients.fund.getFundOperation).toHaveBeenCalledTimes(1);
        });
        it("should return COMPLETE when the fund operation is complete", async () => {
            coinbase_1.Coinbase.apiClients.fund.getFundOperation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FUND_OPERATION_MODEL,
                status: api_1.FundOperationStatusEnum.Complete,
            });
            await fundOperation.reload();
            expect(fundOperation.getStatus()).toEqual(types_1.FundOperationStatus.COMPLETE);
            expect(coinbase_1.Coinbase.apiClients.fund.getFundOperation).toHaveBeenCalledTimes(1);
        });
        it("should return FAILED when the fund operation has failed", async () => {
            coinbase_1.Coinbase.apiClients.fund.getFundOperation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FUND_OPERATION_MODEL,
                status: api_1.FundOperationStatusEnum.Failed,
            });
            await fundOperation.reload();
            expect(fundOperation.getStatus()).toEqual(types_1.FundOperationStatus.FAILED);
            expect(coinbase_1.Coinbase.apiClients.fund.getFundOperation).toHaveBeenCalledTimes(1);
        });
    });
    describe("#wait", () => {
        it("should wait for operation to complete", async () => {
            coinbase_1.Coinbase.apiClients.fund.getFundOperation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FUND_OPERATION_MODEL,
                status: api_1.FundOperationStatusEnum.Complete,
            });
            const completedFundOperation = await fundOperation.wait();
            expect(completedFundOperation).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(completedFundOperation.getStatus()).toEqual(types_1.FundOperationStatus.COMPLETE);
            expect(coinbase_1.Coinbase.apiClients.fund.getFundOperation).toHaveBeenCalledTimes(1);
        });
        it("should return the failed fund operation when the operation has failed", async () => {
            coinbase_1.Coinbase.apiClients.fund.getFundOperation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FUND_OPERATION_MODEL,
                status: api_1.FundOperationStatusEnum.Failed,
            });
            const completedFundOperation = await fundOperation.wait();
            expect(completedFundOperation).toBeInstanceOf(fund_operation_1.FundOperation);
            expect(completedFundOperation.getStatus()).toEqual(types_1.FundOperationStatus.FAILED);
            expect(coinbase_1.Coinbase.apiClients.fund.getFundOperation).toHaveBeenCalledTimes(1);
        });
        it("should throw an error when the fund operation has not been created", async () => {
            coinbase_1.Coinbase.apiClients.fund.getFundOperation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FUND_OPERATION_MODEL,
                status: types_1.FundOperationStatus.PENDING,
            });
            await expect(fundOperation.wait({ timeoutSeconds: 0.05, intervalSeconds: 0.05 })).rejects.toThrow(new errors_1.TimeoutError("Fund operation timed out"));
        });
    });
});
