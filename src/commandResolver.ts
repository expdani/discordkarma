import {Message} from "discord.js";
import {TypeMessageResponse} from "./types/response";
import {setupCurrencyCommands} from "./controllers/currency/commands";
import {sayKarmaCommand, sayTopCommand} from "./controllers/karma/commands";
import setupMinigameCommands from "./controllers/minigames";
import {sayCommand} from "./controllers/admin/commands";

type TypeResolver = (message: Message, context: TypeMessageResponse) => void;

type TypeResolvers = {
    [key: string]: TypeResolver;
};

const resolvers: TypeResolvers = {
    balance: setupCurrencyCommands,
    trivia: setupMinigameCommands,
    karma: sayKarmaCommand,
    leaderboard: sayTopCommand,
    say: sayCommand,
    hello_there: (message, context) => {
        if (context.response) {
            message.channel.send(context.response);
        } else {
            message.channel.send("General Kenobi");
        }
    },
};

export default resolvers;
