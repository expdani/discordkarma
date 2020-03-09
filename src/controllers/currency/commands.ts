import {Message} from "discord.js";
import {getUserBalance} from "./";

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(message: Message) {
    const messageChannel = message.channel;

    getUserBalance(messageChannel);
}
