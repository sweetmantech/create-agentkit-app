import { CdpAction, CdpActionSchemaAny } from "../../cdp_action";
import { WowBuyTokenAction } from "./actions/buy_token";
import { WowSellTokenAction } from "./actions/sell_token";
import { WowCreateTokenAction } from "./actions/create_token";
/**
 * Retrieves all WOW protocol action instances.
 * WARNING: All new WowAction classes must be instantiated here to be discovered.
 *
 * @returns Array of WOW protocol action instances
 */
export declare function getAllWowActions(): CdpAction<CdpActionSchemaAny>[];
export declare const WOW_ACTIONS: CdpAction<CdpActionSchemaAny>[];
export { WowBuyTokenAction, WowSellTokenAction, WowCreateTokenAction };
