"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../coinbase/validator");
const coinbase_1 = require("../coinbase/coinbase");
const utils_1 = require("./utils");
const types_1 = require("../coinbase/types");
const api_1 = require("../client/api");
describe("Validator", () => {
    beforeAll(() => {
        // Mock the validator functions.
        coinbase_1.Coinbase.apiClients.stake = utils_1.stakeApiMock;
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("constructor", () => {
        const validatorModel = (0, utils_1.mockEthereumValidator)("100", types_1.ValidatorStatus.ACTIVE, "0xpublic_key_1");
        const validator = new validator_1.Validator(validatorModel);
        it("initializes a new Validator", () => {
            expect(validator).toBeInstanceOf(validator_1.Validator);
        });
        it("should raise an error when initialized with a model of a different type", () => {
            expect(() => new validator_1.Validator(null)).toThrow("Invalid model type");
        });
    });
    describe(".getStatus", () => {
        const testCases = [
            { input: api_1.ValidatorStatus.Unknown, expected: types_1.ValidatorStatus.UNKNOWN },
            { input: api_1.ValidatorStatus.Provisioning, expected: types_1.ValidatorStatus.PROVISIONING },
            { input: api_1.ValidatorStatus.Provisioned, expected: types_1.ValidatorStatus.PROVISIONED },
            { input: api_1.ValidatorStatus.Deposited, expected: types_1.ValidatorStatus.DEPOSITED },
            { input: api_1.ValidatorStatus.PendingActivation, expected: types_1.ValidatorStatus.PENDING_ACTIVATION },
            { input: api_1.ValidatorStatus.Active, expected: types_1.ValidatorStatus.ACTIVE },
            { input: api_1.ValidatorStatus.Exiting, expected: types_1.ValidatorStatus.EXITING },
            { input: api_1.ValidatorStatus.Exited, expected: types_1.ValidatorStatus.EXITED },
            {
                input: api_1.ValidatorStatus.WithdrawalAvailable,
                expected: types_1.ValidatorStatus.WITHDRAWAL_AVAILABLE,
            },
            {
                input: api_1.ValidatorStatus.WithdrawalComplete,
                expected: types_1.ValidatorStatus.WITHDRAWAL_COMPLETE,
            },
            { input: api_1.ValidatorStatus.ActiveSlashed, expected: types_1.ValidatorStatus.ACTIVE_SLASHED },
            { input: api_1.ValidatorStatus.ExitedSlashed, expected: types_1.ValidatorStatus.EXITED_SLASHED },
            { input: api_1.ValidatorStatus.Reaped, expected: types_1.ValidatorStatus.REAPED },
            { input: "unknown_status", expected: types_1.ValidatorStatus.UNKNOWN },
        ];
        testCases.forEach(({ input, expected }) => {
            it(`should return ${expected} for ${input}`, () => {
                const validatorModel = (0, utils_1.mockEthereumValidator)("100", input, "0xpublic_key_1");
                const validator = new validator_1.Validator(validatorModel);
                expect(validator.getStatus()).toBe(expected);
            });
        });
    });
    describe("#getAPIValidatorStatus", () => {
        const testCases = [
            { input: types_1.ValidatorStatus.UNKNOWN, expected: api_1.ValidatorStatus.Unknown },
            { input: types_1.ValidatorStatus.PROVISIONING, expected: api_1.ValidatorStatus.Provisioning },
            { input: types_1.ValidatorStatus.PROVISIONED, expected: api_1.ValidatorStatus.Provisioned },
            { input: types_1.ValidatorStatus.DEPOSITED, expected: api_1.ValidatorStatus.Deposited },
            { input: types_1.ValidatorStatus.PENDING_ACTIVATION, expected: api_1.ValidatorStatus.PendingActivation },
            { input: types_1.ValidatorStatus.ACTIVE, expected: api_1.ValidatorStatus.Active },
            { input: types_1.ValidatorStatus.EXITING, expected: api_1.ValidatorStatus.Exiting },
            { input: types_1.ValidatorStatus.EXITED, expected: api_1.ValidatorStatus.Exited },
            {
                input: types_1.ValidatorStatus.WITHDRAWAL_AVAILABLE,
                expected: api_1.ValidatorStatus.WithdrawalAvailable,
            },
            {
                input: types_1.ValidatorStatus.WITHDRAWAL_COMPLETE,
                expected: api_1.ValidatorStatus.WithdrawalComplete,
            },
            { input: types_1.ValidatorStatus.ACTIVE_SLASHED, expected: api_1.ValidatorStatus.ActiveSlashed },
            { input: types_1.ValidatorStatus.EXITED_SLASHED, expected: api_1.ValidatorStatus.ExitedSlashed },
            { input: types_1.ValidatorStatus.REAPED, expected: api_1.ValidatorStatus.Reaped },
            { input: "unknown_status", expected: api_1.ValidatorStatus.Unknown },
        ];
        testCases.forEach(({ input, expected }) => {
            it(`should return ${expected} for ${input}`, () => {
                const validatorModel = (0, utils_1.mockEthereumValidator)("100", input, "0xpublic_key_1");
                const validator = new validator_1.Validator(validatorModel);
                expect(validator.getStatus()).toBe(expected);
            });
        });
    });
    it("should return a list of validators for ethereum holesky and eth asset", async () => {
        coinbase_1.Coinbase.apiClients.stake.listValidators = (0, utils_1.mockReturnValue)(utils_1.VALID_ACTIVE_VALIDATOR_LIST);
        const validators = await validator_1.Validator.list(coinbase_1.Coinbase.networks.EthereumHolesky, coinbase_1.Coinbase.assets.Eth, types_1.ValidatorStatus.ACTIVE);
        expect(coinbase_1.Coinbase.apiClients.stake.listValidators).toHaveBeenCalledWith(coinbase_1.Coinbase.networks.EthereumHolesky, coinbase_1.Coinbase.assets.Eth, types_1.ValidatorStatus.ACTIVE);
        expect(validators.length).toEqual(3);
        expect(validators[0].getValidatorId()).toEqual("0xpublic_key_1");
        expect(validators[0].getStatus()).toEqual(types_1.ValidatorStatus.ACTIVE);
        expect(validators[1].getValidatorId()).toEqual("0xpublic_key_2");
        expect(validators[1].getStatus()).toEqual(types_1.ValidatorStatus.ACTIVE);
        expect(validators[2].getValidatorId()).toEqual("0xpublic_key_3");
        expect(validators[2].getStatus()).toEqual(types_1.ValidatorStatus.ACTIVE);
    });
    it("should return a validator for ethereum holesky and eth asset", async () => {
        coinbase_1.Coinbase.apiClients.stake.getValidator = (0, utils_1.mockReturnValue)((0, utils_1.mockEthereumValidator)("100", types_1.ValidatorStatus.EXITING, "0x123"));
        const validator = await validator_1.Validator.fetch(coinbase_1.Coinbase.networks.EthereumHolesky, coinbase_1.Coinbase.assets.Eth, "0x123");
        expect(coinbase_1.Coinbase.apiClients.stake.getValidator).toHaveBeenCalledWith(coinbase_1.Coinbase.networks.EthereumHolesky, coinbase_1.Coinbase.assets.Eth, "0x123");
        expect(validator.getValidatorId()).toEqual("0x123");
        expect(validator.getStatus()).toEqual(types_1.ValidatorStatus.EXITING);
        expect(validator.toString()).toEqual("Id: 0x123 Status: exiting");
    });
});
