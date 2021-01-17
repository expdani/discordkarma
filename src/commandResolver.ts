import {Message} from "discord.js";
import {setupCurrencyCommands} from "./controllers/currency/commands";
import {setupKarmaCommands} from "./controllers/karma/commands";
import setupMinigameCommands from "./controllers/minigames";

type TypeResolver = (message: Message) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupCurrencyCommands,
    trivia: setupMinigameCommands,
    karma: setupKarmaCommands,
};

export default resolvers;
