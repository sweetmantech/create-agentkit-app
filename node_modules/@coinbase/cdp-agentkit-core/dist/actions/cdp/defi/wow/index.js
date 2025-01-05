"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WowCreateTokenAction = exports.WowSellTokenAction = exports.WowBuyTokenAction = exports.WOW_ACTIONS = void 0;
exports.getAllWowActions = getAllWowActions;
const buy_token_1 = require("./actions/buy_token");
Object.defineProperty(exports, "WowBuyTokenAction", { enumerable: true, get: function () { return buy_token_1.WowBuyTokenAction; } });
const sell_token_1 = require("./actions/sell_token");
Object.defineProperty(exports, "WowSellTokenAction", { enumerable: true, get: function () { return sell_token_1.WowSellTokenAction; } });
const create_token_1 = require("./actions/create_token");
Object.defineProperty(exports, "WowCreateTokenAction", { enumerable: true, get: function () { return create_token_1.WowCreateTokenAction; } });
/**
 * Retrieves all WOW protocol action instances.
 * WARNING: All new WowAction classes must be instantiated here to be discovered.
 *
 * @returns Array of WOW protocol action instances
 */
function getAllWowActions() {
    // eslint-disable-next-line prettier/prettier
    return [new buy_token_1.WowBuyTokenAction(), new sell_token_1.WowSellTokenAction(), new create_token_1.WowCreateTokenAction()];
}
exports.WOW_ACTIONS = getAllWowActions();
