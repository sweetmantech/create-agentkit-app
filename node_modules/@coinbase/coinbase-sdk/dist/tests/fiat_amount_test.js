"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fiat_amount_1 = require("../coinbase/fiat_amount");
describe("FiatAmount", () => {
    describe(".fromModel", () => {
        it("should convert a FiatAmount model to a FiatAmount", () => {
            const model = {
                amount: "100.50",
                currency: "USD",
            };
            const fiatAmount = fiat_amount_1.FiatAmount.fromModel(model);
            expect(fiatAmount.getAmount()).toBe("100.50");
            expect(fiatAmount.getCurrency()).toBe("USD");
        });
    });
    describe("#getAmount", () => {
        it("should return the correct amount", () => {
            const fiatAmount = new fiat_amount_1.FiatAmount("50.25", "USD");
            expect(fiatAmount.getAmount()).toBe("50.25");
        });
    });
    describe("#getCurrency", () => {
        it("should return the correct currency", () => {
            const fiatAmount = new fiat_amount_1.FiatAmount("50.25", "USD");
            expect(fiatAmount.getCurrency()).toBe("USD");
        });
    });
    describe("#toString", () => {
        it("should return the correct string representation", () => {
            const fiatAmount = new fiat_amount_1.FiatAmount("75.00", "USD");
            const expectedStr = "FiatAmount(amount: '75.00', currency: 'USD')";
            expect(fiatAmount.toString()).toBe(expectedStr);
        });
    });
});
