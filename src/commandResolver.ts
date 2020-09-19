import {Message} from "discord.js";
import {TypeMessageResponse} from "./types/response";
import {setupCurrencyCommands} from "./controllers/currency/commands";
import {setupKarmaCommands} from "./controllers/karma/commands";
import setupMinigameCommands from "./controllers/minigames";

type TypeResolver = (message: Message, context: TypeMessageResponse) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupCurrencyCommands,
    trivia: setupMinigameCommands,
    karma: setupKarmaCommands,
    hello_there: (message, context) => {
        if (context.response) {
            message.channel.send(context.response);
        } else {
            message.channel.send("General Kenobi");
        }
    },
};

export default resolvers;
