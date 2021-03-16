import {Message} from "discord.js";
import {TypeMessageResponse} from "./types/response";
import {setupCurrencyCommands} from "./controllers/currency/commands";
import {setupKarmaCommands} from "./controllers/karma/commands";
import setupMinigameCommands from "./controllers/minigames";
import {sayCommand} from "./controllers/admin/commands";

type TypeResolver = (message: Message, context: TypeMessageResponse) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupCurrencyCommands,
    trivia: setupMinigameCommands,
    karma: setupKarmaCommands,
    say: sayCommand,
};

export default resolvers;
