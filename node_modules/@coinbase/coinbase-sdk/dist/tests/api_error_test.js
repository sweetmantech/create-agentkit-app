"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const api_error_1 = require("./../coinbase/api_error"); // Adjust the import path accordingly
describe("APIError", () => {
    test("should create default APIError without response data", () => {
        const axiosError = new axios_1.AxiosError("Network Error");
        const apiError = new api_error_1.APIError(axiosError);
        expect(apiError.httpCode).toBeNull();
        expect(apiError.apiCode).toBeNull();
        expect(apiError.apiMessage).toBeNull();
        expect(apiError.correlationId).toBeNull();
        expect(apiError.toString()).toBe("APIError{}");
    });
    test("should create APIError with response data", () => {
        const axiosError = {
            response: {
                status: 400,
                data: {
                    code: "invalid_wallet_id",
                    message: "Invalid wallet ID",
                    correlation_id: "123",
                },
            },
        };
        const apiError = new api_error_1.APIError(axiosError);
        expect(apiError.httpCode).toBe(400);
        expect(apiError.apiCode).toBe("invalid_wallet_id");
        expect(apiError.apiMessage).toBe("Invalid wallet ID");
        expect(apiError.correlationId).toBe("123");
        expect(apiError.toString()).toBe("APIError{httpCode: 400, apiCode: invalid_wallet_id, apiMessage: Invalid wallet ID, correlationId: 123}");
    });
    test.each([
        ["unimplemented", api_error_1.UnimplementedError],
        ["unauthorized", api_error_1.UnauthorizedError],
        ["not_found", api_error_1.NotFoundError],
        ["invalid_wallet_id", api_error_1.InvalidWalletIDError],
        ["invalid_address_id", api_error_1.InvalidAddressIDError],
        ["invalid_wallet", api_error_1.InvalidWalletError],
        ["invalid_address", api_error_1.InvalidAddressError],
        ["invalid_amount", api_error_1.InvalidAmountError],
        ["invalid_transfer_id", api_error_1.InvalidTransferIDError],
        ["invalid_page_token", api_error_1.InvalidPageError],
        ["invalid_page_limit", api_error_1.InvalidLimitError],
        ["already_exists", api_error_1.AlreadyExistsError],
        ["malformed_request", api_error_1.MalformedRequestError],
        ["unsupported_asset", api_error_1.UnsupportedAssetError],
        ["invalid_asset_id", api_error_1.InvalidAssetIDError],
        ["invalid_destination", api_error_1.InvalidDestinationError],
        ["invalid_network_id", api_error_1.InvalidNetworkIDError],
        ["resource_exhausted", api_error_1.ResourceExhaustedError],
        ["faucet_limit_reached", api_error_1.FaucetLimitReachedError],
        ["invalid_signed_payload", api_error_1.InvalidSignedPayloadError],
        ["invalid_transfer_status", api_error_1.InvalidTransferStatusError],
        ["network_feature_unsupported", api_error_1.NetworkFeatureUnsupportedError],
    ])("should create %s error type", (code, ErrorType) => {
        const axiosError = {
            response: {
                status: 400,
                data: {
                    code,
                    message: "Error message",
                },
            },
        };
        const apiError = api_error_1.APIError.fromError(axiosError);
        expect(apiError).toBeInstanceOf(ErrorType);
    });
});
