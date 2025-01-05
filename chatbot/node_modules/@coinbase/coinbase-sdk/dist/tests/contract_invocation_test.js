"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const decimal_js_1 = require("decimal.js");
const api_1 = require("../client/api");
const types_1 = require("../coinbase/types");
const contract_invocation_1 = require("../coinbase/contract_invocation");
const transaction_1 = require("../coinbase/transaction");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const errors_1 = require("../coinbase/errors");
const api_error_1 = require("../coinbase/api_error");
describe("Contract Invocation Class", () => {
    let contractInvocationModel;
    let contractInvocation;
    beforeEach(() => {
        coinbase_1.Coinbase.apiClients.contractInvocation = utils_1.contractInvocationApiMock;
        contractInvocationModel = utils_1.VALID_CONTRACT_INVOCATION_MODEL;
        contractInvocation = contract_invocation_1.ContractInvocation.fromModel(contractInvocationModel);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("constructor", () => {
        it("initializes a new ContractInvocation", () => {
            expect(contractInvocation).toBeInstanceOf(contract_invocation_1.ContractInvocation);
        });
        it("raises an error when the contractInvocation model is empty", () => {
            expect(() => contract_invocation_1.ContractInvocation.fromModel(undefined)).toThrow("ContractInvocation model cannot be empty");
        });
    });
    describe("#getId", () => {
        it("returns the contract invocation ID", () => {
            expect(contractInvocation.getId()).toEqual(utils_1.VALID_CONTRACT_INVOCATION_MODEL.contract_invocation_id);
        });
    });
    describe("#getNetworkId", () => {
        it("returns the network ID", () => {
            expect(contractInvocation.getNetworkId()).toEqual(utils_1.VALID_CONTRACT_INVOCATION_MODEL.network_id);
        });
    });
    describe("#getWalletId", () => {
        it("returns the wallet ID", () => {
            expect(contractInvocation.getWalletId()).toEqual(utils_1.VALID_CONTRACT_INVOCATION_MODEL.wallet_id);
        });
    });
    describe("#getFromAddressId", () => {
        it("returns the source address ID", () => {
            expect(contractInvocation.getFromAddressId()).toEqual(utils_1.VALID_CONTRACT_INVOCATION_MODEL.address_id);
        });
    });
    describe("#getContractAddressId", () => {
        it("returns the contract address ID", () => {
            expect(contractInvocation.getContractAddressId()).toEqual(utils_1.VALID_CONTRACT_INVOCATION_MODEL.contract_address);
        });
    });
    describe("#getMethod", () => {
        it("return the conrtact invocation's method", () => {
            expect(contractInvocation.getMethod()).toEqual(utils_1.VALID_CONTRACT_INVOCATION_MODEL.method);
        });
    });
    describe("#getArgs", () => {
        it("returns the parsed arguments", () => {
            expect(contractInvocation.getArgs()).toEqual(utils_1.MINT_NFT_ARGS);
        });
    });
    describe("#getAbi", () => {
        it("returns the parsed ABI", () => {
            expect(contractInvocation.getAbi()).toEqual(utils_1.MINT_NFT_ABI);
        });
    });
    describe("#getAmount", () => {
        it("returns the amount", () => {
            expect(contractInvocation.getAmount()).toEqual(new decimal_js_1.Decimal(0));
        });
    });
    describe("#getTransactionHash", () => {
        describe("when the transaction has a hash", () => {
            let transactionHash = "0xtransactionHash";
            beforeEach(() => {
                contractInvocation = contract_invocation_1.ContractInvocation.fromModel({
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                    transaction: {
                        ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                        transaction_hash: transactionHash,
                    },
                });
            });
            it("returns the transaction hash", () => {
                expect(contractInvocation.getTransactionHash()).toEqual(transactionHash);
            });
        });
        describe("when the transaction does not have a hash", () => {
            it("returns undefined", () => {
                expect(contractInvocation.getTransactionHash()).toBeUndefined();
            });
        });
    });
    describe("#getTransactionLink", () => {
        describe("when the transaction has a transaction link", () => {
            let transactionLink = `https://sepolia.basescan.org/tx/0xtransactionHash`;
            beforeEach(() => {
                contractInvocation = contract_invocation_1.ContractInvocation.fromModel({
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                    transaction: {
                        ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                        transaction_link: transactionLink,
                    },
                });
            });
            it("returns the transaction link", () => {
                expect(contractInvocation.getTransactionLink()).toEqual(transactionLink);
            });
        });
        describe("when the transaction does not have a link", () => {
            it("returns undefined", () => {
                expect(contractInvocation.getTransactionLink()).toBeUndefined();
            });
        });
    });
    describe("#getTransaction", () => {
        it("returns the transaction", () => {
            expect(contractInvocation.getTransaction()).toBeInstanceOf(transaction_1.Transaction);
        });
    });
    describe("#getRawTransaction", () => {
        it("returns the ContractInvocation raw transaction", () => {
            expect(contractInvocation.getRawTransaction()).toBeInstanceOf(ethers_1.ethers.Transaction);
        });
    });
    describe("#getStatus", () => {
        let txStatus;
        beforeEach(() => {
            contractInvocationModel = {
                ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                transaction: {
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                    status: txStatus,
                },
            };
            contractInvocation = contract_invocation_1.ContractInvocation.fromModel(contractInvocationModel);
        });
        [
            types_1.TransactionStatus.PENDING,
            types_1.TransactionStatus.BROADCAST,
            types_1.TransactionStatus.COMPLETE,
            types_1.TransactionStatus.FAILED,
        ].forEach(status => {
            describe(`when the transaction has status ${status}`, () => {
                beforeAll(() => (txStatus = status));
                afterAll(() => (txStatus = undefined));
                it("returns the correct status", async () => {
                    expect(contractInvocation.getStatus()).toEqual(status);
                });
            });
        });
    });
    describe("#broadcast", () => {
        let signedPayload = "0xsignedHash";
        beforeEach(() => {
            // Ensure signed payload is present.
            contractInvocation = contract_invocation_1.ContractInvocation.fromModel({
                ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                transaction: {
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                    signed_payload: signedPayload,
                },
            });
        });
        describe("when it was successful", () => {
            let broadcastedInvocation;
            beforeEach(async () => {
                coinbase_1.Coinbase.apiClients.contractInvocation.broadcastContractInvocation = (0, utils_1.mockReturnValue)({
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                    transaction: {
                        ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                        signed_payload: signedPayload,
                        status: types_1.TransactionStatus.BROADCAST,
                    },
                });
                broadcastedInvocation = await contractInvocation.broadcast();
            });
            it("returns the broadcasted contract invocation", async () => {
                expect(broadcastedInvocation).toBeInstanceOf(contract_invocation_1.ContractInvocation);
                expect(broadcastedInvocation.getStatus()).toEqual(types_1.TransactionStatus.BROADCAST);
            });
            it("broadcasts the contract invocation", async () => {
                expect(coinbase_1.Coinbase.apiClients.contractInvocation.broadcastContractInvocation).toHaveBeenCalledWith(contractInvocation.getWalletId(), contractInvocation.getFromAddressId(), contractInvocation.getId(), {
                    signed_payload: signedPayload.slice(2),
                });
                expect(coinbase_1.Coinbase.apiClients.contractInvocation.broadcastContractInvocation).toHaveBeenCalledTimes(1);
            });
        });
        describe("when the transaction is not signed", () => {
            beforeEach(() => {
                contractInvocation = contract_invocation_1.ContractInvocation.fromModel(utils_1.VALID_CONTRACT_INVOCATION_MODEL);
            });
            it("throws an error", async () => {
                expect(contractInvocation.broadcast()).rejects.toThrow("Cannot broadcast unsigned ContractInvocation");
            });
        });
        describe("when broadcasting fails", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.contractInvocation.broadcastContractInvocation =
                    (0, utils_1.mockReturnRejectedValue)(new api_error_1.APIError({
                        response: {
                            status: 400,
                            data: {
                                code: "invalid_signed_payload",
                                message: "failed to broadcast contract invocation: invalid signed payload",
                            },
                        },
                    }));
            });
            it("throws an error", async () => {
                expect(contractInvocation.broadcast()).rejects.toThrow(api_error_1.APIError);
            });
        });
    });
    describe("#sign", () => {
        let signingKey = ethers_1.ethers.Wallet.createRandom();
        it("return the signature", async () => {
            const contractInvocation = contract_invocation_1.ContractInvocation.fromModel({
                ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                transaction: {
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                    signed_payload: "0xsignedHash",
                },
            });
            const signature = await contractInvocation.sign(signingKey);
            expect(signature).toEqual(contractInvocation.getTransaction().getSignature());
        });
    });
    describe("#wait", () => {
        describe("when the transaction is complete", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.contractInvocation.getContractInvocation = (0, utils_1.mockReturnValue)({
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                    transaction: {
                        ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                        status: api_1.TransactionStatusEnum.Complete,
                    },
                });
            });
            it("successfully waits and returns", async () => {
                const completedContractInvocation = await contractInvocation.wait();
                expect(completedContractInvocation).toBeInstanceOf(contract_invocation_1.ContractInvocation);
                expect(completedContractInvocation.getStatus()).toEqual(types_1.TransactionStatus.COMPLETE);
            });
        });
        describe("when the transaction is failed", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.contractInvocation.getContractInvocation = (0, utils_1.mockReturnValue)({
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                    transaction: {
                        ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                        status: api_1.TransactionStatusEnum.Failed,
                    },
                    status: types_1.TransactionStatus.FAILED,
                });
            });
            it("successfully waits and returns a failed invocation", async () => {
                const completedContractInvocation = await contractInvocation.wait();
                expect(completedContractInvocation).toBeInstanceOf(contract_invocation_1.ContractInvocation);
                expect(completedContractInvocation.getStatus()).toEqual(types_1.TransactionStatus.FAILED);
            });
        });
        describe("when the transaction is pending", () => {
            beforeEach(() => {
                coinbase_1.Coinbase.apiClients.contractInvocation.getContractInvocation = (0, utils_1.mockReturnValue)({
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                    transaction: {
                        ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                        status: api_1.TransactionStatusEnum.Pending,
                    },
                });
            });
            it("throws a timeout error", async () => {
                expect(contractInvocation.wait({ timeoutSeconds: 0.05, intervalSeconds: 0.05 })).rejects.toThrow(new errors_1.TimeoutError("ContractInvocation timed out"));
            });
        });
    });
    describe("#reload", () => {
        it("returns the updated contract invocation", async () => {
            coinbase_1.Coinbase.apiClients.contractInvocation.getContractInvocation = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_CONTRACT_INVOCATION_MODEL,
                transaction: {
                    ...utils_1.VALID_CONTRACT_INVOCATION_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Complete,
                },
            });
            await contractInvocation.reload();
            expect(contractInvocation.getStatus()).toEqual(types_1.TransactionStatus.COMPLETE);
            expect(coinbase_1.Coinbase.apiClients.contractInvocation.getContractInvocation).toHaveBeenCalledTimes(1);
        });
    });
    describe("#toString", () => {
        it("returns the same value as toString", () => {
            expect(contractInvocation.toString()).toEqual(`ContractInvocation{contractInvocationId: '${contractInvocation.getId()}', networkId: '${contractInvocation.getNetworkId()}', ` +
                `fromAddressId: '${contractInvocation.getFromAddressId()}', contractAddressId: '${contractInvocation.getContractAddressId()}', ` +
                `method: '${contractInvocation.getMethod()}', args: '${contractInvocation.getArgs()}', transactionHash: '${contractInvocation.getTransactionHash()}', ` +
                `transactionLink: '${contractInvocation.getTransactionLink()}', status: '${contractInvocation.getStatus()}'}`);
        });
    });
});
