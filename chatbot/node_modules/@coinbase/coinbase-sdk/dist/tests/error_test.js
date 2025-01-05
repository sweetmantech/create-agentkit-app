"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../coinbase/errors");
describe("Error Classes", () => {
    it("InvalidAPIKeyFormatError should have the correct message and name", () => {
        const error = new errors_1.InvalidAPIKeyFormatError();
        expect(error.message).toBe(errors_1.InvalidAPIKeyFormatError.DEFAULT_MESSAGE);
        expect(error.name).toBe("InvalidAPIKeyFormatError");
    });
    it("InvalidAPIKeyFormatError should accept a custom message", () => {
        const customMessage = "Custom invalid API key format message";
        const error = new errors_1.InvalidAPIKeyFormatError(customMessage);
        expect(error.message).toBe(customMessage);
    });
    it("ArgumentError should have the correct message and name", () => {
        const error = new errors_1.ArgumentError();
        expect(error.message).toBe(errors_1.ArgumentError.DEFAULT_MESSAGE);
        expect(error.name).toBe("ArgumentError");
    });
    it("ArgumentError should accept a custom message", () => {
        const customMessage = "Custom argument error message";
        const error = new errors_1.ArgumentError(customMessage);
        expect(error.message).toBe(customMessage);
    });
    it("InvalidConfigurationError should have the correct message and name", () => {
        const error = new errors_1.InvalidConfigurationError();
        expect(error.message).toBe(errors_1.InvalidConfigurationError.DEFAULT_MESSAGE);
        expect(error.name).toBe("InvalidConfigurationError");
    });
    it("InvalidConfigurationError should accept a custom message", () => {
        const customMessage = "Custom invalid configuration message";
        const error = new errors_1.InvalidConfigurationError(customMessage);
        expect(error.message).toBe(customMessage);
    });
    it("InvalidUnsignedPayloadError should have the correct message and name", () => {
        const error = new errors_1.InvalidUnsignedPayloadError();
        expect(error.message).toBe(errors_1.InvalidUnsignedPayloadError.DEFAULT_MESSAGE);
        expect(error.name).toBe("InvalidUnsignedPayloadError");
    });
    it("InvalidUnsignedPayloadError should accept a custom message", () => {
        const customMessage = "Custom invalid unsigned payload message";
        const error = new errors_1.InvalidUnsignedPayloadError(customMessage);
        expect(error.message).toBe(customMessage);
    });
    it("AlreadySignedError should have the correct message and name", () => {
        const error = new errors_1.AlreadySignedError();
        expect(error.message).toBe(errors_1.AlreadySignedError.DEFAULT_MESSAGE);
        expect(error.name).toBe("AlreadySignedError");
    });
    it("AlreadySignedError should accept a custom message", () => {
        const customMessage = "Custom already signed error message";
        const error = new errors_1.AlreadySignedError(customMessage);
        expect(error.message).toBe(customMessage);
    });
});
