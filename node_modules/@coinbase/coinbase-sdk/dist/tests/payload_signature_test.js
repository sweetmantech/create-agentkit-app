"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payload_signature_1 = require("../coinbase/payload_signature");
const utils_1 = require("./utils");
const client_1 = require("../client");
const coinbase_1 = require("../coinbase/coinbase");
const api_error_1 = require("../coinbase/api_error");
describe("PayloadSignature", () => {
    beforeEach(() => { });
    describe("constructor", () => {
        it("initializes a new PayloadSignature", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature).toBeInstanceOf(payload_signature_1.PayloadSignature);
        });
        it("should raise an error when initialized with an invalid model", () => {
            expect(() => new payload_signature_1.PayloadSignature(null)).toThrow("Invalid model type");
        });
    });
    describe("#getId", () => {
        it("should return the Payload Signature ID", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getId()).toEqual(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.payload_signature_id);
        });
    });
    describe("#getWalletId", () => {
        it("should return the Wallet ID", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getWalletId()).toEqual(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.wallet_id);
        });
    });
    describe("#getAddressId", () => {
        it("should return the Address ID", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getAddressId()).toEqual(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.address_id);
        });
    });
    describe("#getUnsignedPayload", () => {
        it("should return the Unsigned Payload", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getUnsignedPayload()).toEqual(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.unsigned_payload);
        });
    });
    describe("#getSignature", () => {
        it("should return undefined when the PayloadSignature has not been signed", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getSignature()).toBeUndefined();
        });
        it("should return the signature when the PayloadSignature has been signed", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getSignature()).toEqual(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL.signature);
        });
    });
    describe("#getStatus", () => {
        it("should return a pending status", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getStatus()).toEqual("pending");
        });
        it("should return a signed status", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.getStatus()).toEqual("signed");
        });
        it("should return a failed status", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature({
                ...utils_1.VALID_PAYLOAD_SIGNATURE_MODEL,
                status: client_1.PayloadSignatureStatusEnum.Failed,
            });
            expect(payloadSignature.getStatus()).toEqual("failed");
        });
    });
    describe("#isTerminalState", () => {
        it("should not be in a terminal state", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.isTerminalState()).toEqual(false);
        });
        it("should be in a terminal state", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.isTerminalState()).toEqual(true);
        });
    });
    describe("#wait", () => {
        beforeAll(() => {
            coinbase_1.Coinbase.apiClients.address = utils_1.addressesApiMock;
        });
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("should update Payload Signature model", async () => {
            coinbase_1.Coinbase.apiClients.address.getPayloadSignature = (0, utils_1.mockReturnValue)(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
            let payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            await payloadSignature.wait();
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledWith(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.wallet_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.address_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.payload_signature_id);
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledTimes(1);
            expect(payloadSignature.getStatus()).toEqual("signed");
            expect(payloadSignature.isTerminalState()).toEqual(true);
        });
        it("should throw an APIError when the API call to get payload signature fails", async () => {
            coinbase_1.Coinbase.apiClients.address.getPayloadSignature = (0, utils_1.mockReturnRejectedValue)(new api_error_1.APIError("Failed to get payload signature"));
            let payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(async () => {
                await payloadSignature.reload();
            }).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledWith(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.wallet_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.address_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.payload_signature_id);
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledTimes(1);
        });
    });
    describe("#reload", () => {
        beforeAll(() => {
            coinbase_1.Coinbase.apiClients.address = utils_1.addressesApiMock;
        });
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("should update Payload Signature model", async () => {
            coinbase_1.Coinbase.apiClients.address.getPayloadSignature = (0, utils_1.mockReturnValue)(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
            let payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            await payloadSignature.reload();
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledWith(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.wallet_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.address_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.payload_signature_id);
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledTimes(1);
            expect(payloadSignature.getStatus()).toEqual("signed");
        });
        it("should throw an APIError when the API call to get payload signature fails", async () => {
            coinbase_1.Coinbase.apiClients.address.getPayloadSignature = (0, utils_1.mockReturnRejectedValue)(new api_error_1.APIError("Failed to get payload signature"));
            let payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL);
            expect(async () => {
                await payloadSignature.reload();
            }).rejects.toThrow(Error);
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledWith(utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.wallet_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.address_id, utils_1.VALID_PAYLOAD_SIGNATURE_MODEL.payload_signature_id);
            expect(coinbase_1.Coinbase.apiClients.address.getPayloadSignature).toHaveBeenCalledTimes(1);
        });
    });
    describe("#toString", () => {
        let payloadSignature;
        beforeAll(() => {
            payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
        });
        it("includes PayloadSignature details", () => {
            expect(payloadSignature.toString()).toContain(payloadSignature.getStatus());
        });
        it("returns the same value as toString", () => {
            const payloadSignature = new payload_signature_1.PayloadSignature(utils_1.VALID_SIGNED_PAYLOAD_SIGNATURE_MODEL);
            expect(payloadSignature.toString()).toEqual(`PayloadSignature { status: '${payloadSignature.getStatus()}', unsignedPayload: '${payloadSignature.getUnsignedPayload()}', signature: ${payloadSignature.getSignature()} }`);
        });
    });
});
