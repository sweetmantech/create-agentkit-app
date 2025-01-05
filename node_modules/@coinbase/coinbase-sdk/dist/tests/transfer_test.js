"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const decimal_js_1 = require("decimal.js");
const api_1 = require("../client/api");
const types_1 = require("../coinbase/types");
const transfer_1 = require("../coinbase/transfer");
const sponsored_send_1 = require("../coinbase/sponsored_send");
const transaction_1 = require("../coinbase/transaction");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const errors_1 = require("../coinbase/errors");
const api_error_1 = require("../coinbase/api_error");
const amount = new decimal_js_1.Decimal(ethers_1.ethers.parseUnits("100", 18).toString());
const ethAmount = amount.div(Math.pow(10, 18));
const signedPayload = "02f86b83014a3401830f4240830f4350825208946cd01c0f55ce9e0bf78f5e90f72b4345b" +
    "16d515d0280c001a0566afb8ab09129b3f5b666c3a1e4a7e92ae12bbee8c75b4c6e0c46f6" +
    "6dd10094a02115d1b52c49b39b6cb520077161c9bf636730b1b40e749250743f4524e9e4ba";
const transactionHash = "0x6c087c1676e8269dd81e0777244584d0cbfd39b6997b3477242a008fa9349e11";
describe("Transfer Class", () => {
    let transferModel;
    let transfer;
    beforeEach(() => {
        coinbase_1.Coinbase.apiClients.transfer = utils_1.transfersApiMock;
        transferModel = utils_1.VALID_TRANSFER_MODEL;
        transfer = transfer_1.Transfer.fromModel(transferModel);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("constructor", () => {
        it("should initialize a new Transfer", () => {
            expect(transfer).toBeInstanceOf(transfer_1.Transfer);
        });
        it("should raise an error when the transfer model is empty", () => {
            expect(() => transfer_1.Transfer.fromModel(undefined)).toThrow("Transfer model cannot be empty");
        });
    });
    describe("#getId", () => {
        it("should return the transfer ID", () => {
            expect(transfer.getId()).toEqual(utils_1.VALID_TRANSFER_MODEL.transfer_id);
        });
    });
    describe("#getNetworkId", () => {
        it("should return the network ID", () => {
            expect(transfer.getNetworkId()).toEqual(utils_1.VALID_TRANSFER_MODEL.network_id);
        });
    });
    describe("#getWalletId", () => {
        it("should return the wallet ID", () => {
            expect(transfer.getWalletId()).toEqual(utils_1.VALID_TRANSFER_MODEL.wallet_id);
        });
    });
    describe("#getFromAddressId", () => {
        it("should return the source address ID", () => {
            expect(transfer.getFromAddressId()).toEqual(utils_1.VALID_TRANSFER_MODEL.address_id);
        });
    });
    describe("#getDestinationAddressId", () => {
        it("should return the destination address ID", () => {
            expect(transfer.getDestinationAddressId()).toEqual(utils_1.VALID_TRANSFER_MODEL.destination);
        });
    });
    describe("#getAssetId", () => {
        it("should return the asset ID", () => {
            expect(transfer.getAssetId()).toEqual(utils_1.VALID_TRANSFER_MODEL.asset_id);
        });
    });
    describe("#getAmount", () => {
        it("should return the ETH amount when the asset ID is eth", () => {
            expect(transfer.getAmount()).toEqual(ethAmount);
        });
        it("should return the amount when the asset ID is not eth", () => {
            transferModel.asset_id = "usdc";
            transferModel.asset.decimals = 6;
            transferModel.amount = "100000000";
            transfer = transfer_1.Transfer.fromModel(transferModel);
            expect(transfer.getAmount()).toEqual(new decimal_js_1.Decimal(100));
        });
    });
    describe("#getTransactionHash", () => {
        it("should return the transaction hash", () => {
            const transfer = transfer_1.Transfer.fromModel({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    transaction_hash: transactionHash,
                },
            });
            expect(transfer.getTransactionHash()).toEqual(transactionHash);
        });
    });
    describe("#getTransactionLink", () => {
        it("should return the transaction link when the transaction hash is available", () => {
            expect(transfer.getTransactionLink()).toEqual(`https://sepolia.basescan.org/tx/${transferModel.transaction.transaction_hash}`);
        });
    });
    describe("#getTransaction", () => {
        it("should return the Transfer Transaction", () => {
            const transaction = transfer.getTransaction();
            expect(transaction).toBeInstanceOf(transaction_1.Transaction);
        });
        it("should return undefined when using sponsored sends", () => {
            const transfer = transfer_1.Transfer.fromModel(utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL);
            const transaction = transfer.getTransaction();
            expect(transaction).toEqual(undefined);
        });
    });
    describe("#getRawTransaction", () => {
        it("should return the Transfer raw transaction", () => {
            const rawTransaction = transfer.getRawTransaction();
            expect(rawTransaction).toBeInstanceOf(ethers_1.ethers.Transaction);
        });
        it("should return undefined when using sponsored sends", () => {
            const transfer = transfer_1.Transfer.fromModel(utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL);
            const rawTransaction = transfer.getRawTransaction();
            expect(rawTransaction).toEqual(undefined);
        });
    });
    describe("#getSponsoredSend", () => {
        it("should return the Transfer SponsoredSend", () => {
            const transfer = transfer_1.Transfer.fromModel(utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL);
            const sponsoredSend = transfer.getSponsoredSend();
            expect(sponsoredSend).toBeInstanceOf(sponsored_send_1.SponsoredSend);
        });
        it("should return undefined when not using sponsored sends", () => {
            const sponsoredSend = transfer.getSponsoredSend();
            expect(sponsoredSend).toEqual(undefined);
        });
    });
    describe("#getSendTransactionDelegate", () => {
        it("should return the Transfer SponsoredSend", () => {
            const transfer = transfer_1.Transfer.fromModel(utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL);
            const sponsoredSend = transfer.getSendTransactionDelegate();
            expect(sponsoredSend).toBeInstanceOf(sponsored_send_1.SponsoredSend);
        });
        it("should return the Transfer Transaction", () => {
            const transaction = transfer.getSendTransactionDelegate();
            expect(transaction).toBeInstanceOf(transaction_1.Transaction);
        });
        it("should return undefined when no SponsoredSend or Transaction is defined", () => {
            const transfer = transfer_1.Transfer.fromModel({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: undefined,
            });
            const sponsoredSend = transfer.getSponsoredSend();
            expect(sponsoredSend).toEqual(undefined);
        });
    });
    describe("#getStatus", () => {
        describe("when the send transaction delegate is a Transaction", () => {
            it("should return PENDING when the transaction has not been created", async () => {
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.PENDING);
            });
            it("should return PENDING when the transaction has been created but not broadcast", async () => {
                transfer = transfer_1.Transfer.fromModel(transferModel);
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.PENDING);
            });
            it("should return BROADCAST when the transaction has been broadcast but not included in a block", async () => {
                transferModel.transaction.status = api_1.TransactionStatusEnum.Broadcast;
                transfer = transfer_1.Transfer.fromModel(transferModel);
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.BROADCAST);
            });
            it("should return COMPLETE when the transaction has confirmed", async () => {
                transferModel.transaction.status = api_1.TransactionStatusEnum.Complete;
                transfer = transfer_1.Transfer.fromModel(transferModel);
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.COMPLETE);
            });
            it("should return FAILED when the transaction has failed", async () => {
                transferModel.transaction.status = api_1.TransactionStatusEnum.Failed;
                transfer = transfer_1.Transfer.fromModel(transferModel);
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.FAILED);
            });
            it("should return undefined when the transaction does not exist", async () => {
                transferModel.transaction.status = "";
                transfer = transfer_1.Transfer.fromModel(transferModel);
                const status = transfer.getStatus();
                expect(status).toEqual(undefined);
            });
        });
        describe("when the send transaction delegate is a SponsoredSend", () => {
            const transfer = transfer_1.Transfer.fromModel(utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL);
            it("should return PENDING when the SponsoredSend has not been signed", async () => {
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.PENDING);
            });
            it("should return PENDING when the SponsoredSend has been signed but not submitted", async () => {
                const transfer = transfer_1.Transfer.fromModel({
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                    sponsored_send: {
                        ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                        status: api_1.SponsoredSendStatusEnum.Signed,
                    },
                });
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.PENDING);
            });
            it("should return BROADCAST when the SponsoredSend has been submitted", async () => {
                const transfer = transfer_1.Transfer.fromModel({
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                    sponsored_send: {
                        ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                        status: api_1.SponsoredSendStatusEnum.Submitted,
                    },
                });
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.BROADCAST);
            });
            it("should return COMPLETE when the SponsoredSend has been completed", async () => {
                const transfer = transfer_1.Transfer.fromModel({
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                    sponsored_send: {
                        ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                        status: api_1.SponsoredSendStatusEnum.Complete,
                    },
                });
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.COMPLETE);
            });
            it("should return FAILED when the SponsoredSend has failed", async () => {
                const transfer = transfer_1.Transfer.fromModel({
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                    sponsored_send: {
                        ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                        status: api_1.SponsoredSendStatusEnum.Failed,
                    },
                });
                const status = transfer.getStatus();
                expect(status).toEqual(types_1.TransferStatus.FAILED);
            });
            it("should return undefined when the SponsoredSend does not exist", async () => {
                const transfer = transfer_1.Transfer.fromModel({
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                    sponsored_send: {
                        ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                        status: "",
                    },
                });
                const status = transfer.getStatus();
                expect(status).toEqual(undefined);
            });
        });
    });
    describe("#broadcast", () => {
        it("should return a broadcasted transfer when the send transaction delegate is a Transaction", async () => {
            const transfer = transfer_1.Transfer.fromModel({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    signed_payload: "0xsignedHash",
                },
            });
            coinbase_1.Coinbase.apiClients.transfer.broadcastTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: types_1.TransactionStatus.BROADCAST,
                },
            });
            const broadcastedTransfer = await transfer.broadcast();
            expect(broadcastedTransfer).toBeInstanceOf(transfer_1.Transfer);
            expect(broadcastedTransfer.getStatus()).toEqual(types_1.TransferStatus.BROADCAST);
        });
        it("should return a broadcasted transfer when the send transaction delegate is a SponsoredSend", async () => {
            const transfer = transfer_1.Transfer.fromModel({
                ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                sponsored_send: {
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                    signature: "0xsignedHash",
                },
            });
            coinbase_1.Coinbase.apiClients.transfer.broadcastTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL,
                sponsored_send: {
                    ...utils_1.VALID_TRANSFER_SPONSORED_SEND_MODEL.sponsored_send,
                    status: types_1.SponsoredSendStatus.SUBMITTED,
                },
            });
            const broadcastedTransfer = await transfer.broadcast();
            expect(broadcastedTransfer).toBeInstanceOf(transfer_1.Transfer);
            expect(broadcastedTransfer.getStatus()).toEqual(types_1.TransferStatus.BROADCAST);
        });
        it("should throw when the sned transaction delegate has not been signed", async () => {
            expect(transfer.broadcast()).rejects.toThrow(new Error("Cannot broadcast unsigned Transfer"));
        });
        it("should throw an APIErrror if the broadcastTransfer API call fails", async () => {
            const transfer = transfer_1.Transfer.fromModel({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    signed_payload: "0xsignedHash",
                },
            });
            coinbase_1.Coinbase.apiClients.transfer.broadcastTransfer = (0, utils_1.mockReturnRejectedValue)(new api_error_1.APIError("Failed to broadcast transfer"));
            expect(transfer.broadcast()).rejects.toThrow(api_error_1.APIError);
        });
    });
    describe("#sign", () => {
        let signingKey = ethers_1.ethers.Wallet.createRandom();
        it("should return the signature", async () => {
            const transfer = transfer_1.Transfer.fromModel({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    signed_payload: "0xsignedHash",
                },
            });
            const signature = await transfer.sign(signingKey);
            expect(signature).toEqual(transfer.getTransaction().getSignature());
        });
    });
    describe("#wait", () => {
        it("should return the transfer when the transaction is complete", async () => {
            coinbase_1.Coinbase.apiClients.transfer.getTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Complete,
                },
            });
            const completedTransfer = await transfer.wait();
            expect(completedTransfer).toBeInstanceOf(transfer_1.Transfer);
            expect(completedTransfer.getStatus()).toEqual(types_1.TransferStatus.COMPLETE);
        });
        it("should return the failed transfer when the transaction has failed", async () => {
            coinbase_1.Coinbase.apiClients.transfer.getTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Failed,
                },
                status: types_1.TransferStatus.FAILED,
            });
            const completedTransfer = await transfer.wait();
            expect(completedTransfer).toBeInstanceOf(transfer_1.Transfer);
            expect(completedTransfer.getStatus()).toEqual(types_1.TransferStatus.FAILED);
        });
        it("should throw an error when the transaction has not been created", async () => {
            coinbase_1.Coinbase.apiClients.transfer.getTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Pending,
                },
            });
            expect(transfer.wait({ timeoutSeconds: 0.05, intervalSeconds: 0.05 })).rejects.toThrow(new errors_1.TimeoutError("Transfer timed out"));
        });
    });
    describe("#reload", () => {
        it("should return PENDING when the transaction has not been created", async () => {
            coinbase_1.Coinbase.apiClients.transfer.getTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Pending,
                },
            });
            await transfer.reload();
            expect(transfer.getStatus()).toEqual(types_1.TransferStatus.PENDING);
            expect(coinbase_1.Coinbase.apiClients.transfer.getTransfer).toHaveBeenCalledTimes(1);
        });
        it("should return COMPLETE when the transaction is complete", async () => {
            coinbase_1.Coinbase.apiClients.transfer.getTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Complete,
                },
            });
            await transfer.reload();
            expect(transfer.getStatus()).toEqual(types_1.TransferStatus.COMPLETE);
            expect(coinbase_1.Coinbase.apiClients.transfer.getTransfer).toHaveBeenCalledTimes(1);
        });
        it("should return FAILED when the transaction has failed", async () => {
            coinbase_1.Coinbase.apiClients.transfer.getTransfer = (0, utils_1.mockReturnValue)({
                ...utils_1.VALID_TRANSFER_MODEL,
                transaction: {
                    ...utils_1.VALID_TRANSFER_MODEL.transaction,
                    status: api_1.TransactionStatusEnum.Failed,
                },
                status: types_1.TransferStatus.FAILED,
            });
            await transfer.reload();
            expect(transfer.getStatus()).toEqual(types_1.TransferStatus.FAILED);
            expect(coinbase_1.Coinbase.apiClients.transfer.getTransfer).toHaveBeenCalledTimes(1);
        });
    });
    describe("#toString", () => {
        it("returns the same value as toString", () => {
            expect(transfer.toString()).toEqual(`Transfer{transferId: '${transfer.getId()}', networkId: '${transfer.getNetworkId()}', ` +
                `fromAddressId: '${transfer.getFromAddressId()}', destinationAddressId: '${transfer.getDestinationAddressId()}', ` +
                `assetId: '${transfer.getAssetId()}', amount: '${transfer.getAmount()}', transactionHash: '${transfer.getTransactionHash()}', ` +
                `transactionLink: '${transfer.getTransactionLink()}', status: '${transfer.getStatus()}'}`);
        });
    });
});
