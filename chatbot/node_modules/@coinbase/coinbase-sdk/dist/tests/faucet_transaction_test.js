"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faucet_transaction_1 = require("../coinbase/faucet_transaction");
const api_1 = require("../client/api");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
describe("FaucetTransaction tests", () => {
    let faucetTransaction;
    let model;
    const { transaction_hash: txHash, transaction_link: txLink, network_id: networkId, to_address_id: toAddressId, } = utils_1.VALID_FAUCET_TRANSACTION_MODEL.transaction;
    beforeEach(() => {
        coinbase_1.Coinbase.apiClients.externalAddress = utils_1.externalAddressApiMock;
        faucetTransaction = new faucet_transaction_1.FaucetTransaction(utils_1.VALID_FAUCET_TRANSACTION_MODEL);
    });
    describe("constructor", () => {
        it("initializes a FaucetTransaction", () => {
            expect(faucetTransaction).toBeInstanceOf(faucet_transaction_1.FaucetTransaction);
        });
        it("throws an Error if model is not provided", () => {
            expect(() => new faucet_transaction_1.FaucetTransaction(null)).toThrow(`FaucetTransaction model cannot be empty`);
        });
    });
    describe("#getTransactionHash", () => {
        it("returns the transaction hash", () => {
            expect(faucetTransaction.getTransactionHash()).toBe(txHash);
        });
    });
    describe("#getTransactionLink", () => {
        it("returns the transaction link", () => {
            expect(faucetTransaction.getTransactionLink()).toBe(txLink);
        });
    });
    describe("#getNetworkId", () => {
        it("returns the network ID", () => {
            expect(faucetTransaction.getNetworkId()).toBe(networkId);
        });
    });
    describe("#getAddressId", () => {
        it("returns the transaction to address ID", () => {
            expect(faucetTransaction.getAddressId()).toBe(toAddressId);
        });
    });
    describe("#reload", () => {
        let txStatus;
        let reloadedFaucetTx;
        beforeEach(async () => {
            coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_FAUCET_TRANSACTION_MODEL,
                transaction: {
                    ...utils_1.VALID_FAUCET_TRANSACTION_MODEL.transaction,
                    status: txStatus,
                },
            });
            reloadedFaucetTx = await faucetTransaction.reload();
        });
        [
            api_1.TransactionStatusEnum.Pending,
            api_1.TransactionStatusEnum.Complete,
            api_1.TransactionStatusEnum.Failed,
        ].forEach(status => {
            describe(`when the transaction is ${status}`, () => {
                beforeAll(() => (txStatus = status));
                it("returns a FaucetTransaction", () => {
                    expect(reloadedFaucetTx).toBeInstanceOf(faucet_transaction_1.FaucetTransaction);
                });
                it("updates the FaucetTransaction", () => {
                    expect(faucetTransaction.getStatus()).toBe(status);
                });
                it("calls the API to get the FaucetTransaction", () => {
                    expect(coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction).toHaveBeenCalledWith(networkId, toAddressId, txHash);
                    expect(coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
    describe("#wait", () => {
        describe("when the transaction eventually completes", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction = jest
                    .fn()
                    .mockResolvedValueOnce({ data: utils_1.VALID_FAUCET_TRANSACTION_MODEL }) // Pending
                    .mockResolvedValueOnce({
                    data: {
                        ...utils_1.VALID_FAUCET_TRANSACTION_MODEL,
                        transaction: {
                            ...utils_1.VALID_FAUCET_TRANSACTION_MODEL.transaction,
                            status: api_1.TransactionStatusEnum.Complete,
                        },
                    },
                });
            });
            it("returns the completed FaucetTransaction", async () => {
                const completedFaucetTx = await faucetTransaction.wait();
                expect(completedFaucetTx).toBeInstanceOf(faucet_transaction_1.FaucetTransaction);
                expect(completedFaucetTx.getStatus()).toBe(api_1.TransactionStatusEnum.Complete);
            });
            it("calls the API to get the FaucetTransaction", async () => {
                await faucetTransaction.wait();
                expect(coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction).toHaveBeenCalledWith(networkId, toAddressId, txHash);
                expect(coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction).toHaveBeenCalledTimes(2);
            });
        });
        describe("when the transaction eventually fails", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction = jest
                    .fn()
                    .mockResolvedValueOnce({ data: utils_1.VALID_FAUCET_TRANSACTION_MODEL }) // Pending
                    .mockResolvedValueOnce({
                    data: {
                        ...utils_1.VALID_FAUCET_TRANSACTION_MODEL,
                        transaction: {
                            ...utils_1.VALID_FAUCET_TRANSACTION_MODEL.transaction,
                            status: api_1.TransactionStatusEnum.Failed,
                        },
                    },
                });
            });
            it("returns the failed FaucetTransaction", async () => {
                const failedFaucetTx = await faucetTransaction.wait();
                expect(failedFaucetTx).toBeInstanceOf(faucet_transaction_1.FaucetTransaction);
                expect(failedFaucetTx.getStatus()).toBe(api_1.TransactionStatusEnum.Failed);
            });
            it("calls the API to get the FaucetTransaction", async () => {
                await faucetTransaction.wait();
                expect(coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction).toHaveBeenCalledWith(networkId, toAddressId, txHash);
                expect(coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction).toHaveBeenCalledTimes(2);
            });
        });
        describe("when the transaction times out", () => {
            beforeEach(() => {
                // Returns pending for every request.
                coinbase_1.Coinbase.apiClients.externalAddress.getFaucetTransaction = jest
                    .fn()
                    .mockResolvedValueOnce({ data: utils_1.VALID_FAUCET_TRANSACTION_MODEL }); // Pending
            });
            it("throws a TimeoutError", async () => {
                expect(faucetTransaction.wait({ timeoutSeconds: 0.001, intervalSeconds: 0.001 })).rejects.toThrow(new Error("FaucetTransaction timed out"));
            });
        });
    });
});
