import {Interaction, Message} from "discord.js";
import {TypeMessageResponse} from "./types/response";
import {setupBalanceCommand, setupDepositCommand, setupWithdrawCommand} from "./controllers/currency/commands";
import {setupKarmaCommands, setupTopCommands} from "./controllers/karma/commands";
import setupTriviaCommands from "./controllers/minigames/trivia/commands";
import {sayCommand} from "./controllers/admin/commands";
import {setupHelpCommands} from "./controllers/help/commands";
import {setupBuyCommands, setupShopCommands, setupSellCommands} from "./controllers/shop/commands";
import {setupInventoryCommands} from "./controllers/inventory/commands";
import {setupTictactoeCommands} from "./controllers/minigames/tictactoe/commands";
import {setupGlassCommands} from "./controllers/minigames/glass/commands";

type TypeResolver = (message: Message | Interaction, context: TypeMessageResponse) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupBalanceCommand,
    withdraw: setupWithdrawCommand,
    deposit: setupDepositCommand,
    trivia: setupTriviaCommands,
    karma: setupKarmaCommands,
    top: setupTopCommands,
    say: sayCommand,
    help: setupHelpCommands,
    shop: setupShopCommands,
    inventory: setupInventoryCommands,
    buy: setupBuyCommands,
    tictactoe: setupTictactoeCommands,
    glass: setupGlassCommands,
    sell: setupSellCommands,
};

export default resolvers;
