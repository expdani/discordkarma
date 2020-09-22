import {Message} from "discord.js";
import {setupCurrencyCommands} from "./controllers/currency/commands";
import setupMinigameCommands from "./controllers/minigames";

type TypeResolver = (message: Message) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupCurrencyCommands,
    trivia: setupMinigameCommands,
};

export default resolvers;
