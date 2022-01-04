import {Interaction, Message} from "discord.js";
import {TypeMessageResponse} from "./types/response";
import {setupCurrencyCommands} from "./controllers/currency/commands";
import {setupKarmaCommands, setupTopCommands} from "./controllers/karma/commands";
import setupMinigameCommands from "./controllers/minigames/trivia/commands";
import {sayCommand} from "./controllers/admin/commands";
import {setupHelpCommands} from "./controllers/help/commands";
import {setupBuyCommands, setupShopCommands} from "./controllers/shop/commands";
import {setupInventoryCommands} from "./controllers/inventory/commands";

type TypeResolver = (message: Message | Interaction, context: TypeMessageResponse) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupCurrencyCommands,
    trivia: setupMinigameCommands,
    karma: setupKarmaCommands,
    top: setupTopCommands,
    say: sayCommand,
    help: setupHelpCommands,
    shop: setupShopCommands,
    inventory: setupInventoryCommands,
    buy: setupBuyCommands,
    // sell: setupSellCommands,
};

export default resolvers;
