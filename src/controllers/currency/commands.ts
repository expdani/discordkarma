import {Message} from "discord.js";
import {getUserBalance} from "./";
import {CURRENCY_COMMANDS} from "../../types/commands/currency";

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(data: {text: string; message: Message}) {
    const messageChannel = data.message.channel;
    const command = data.text;

    if (command === CURRENCY_COMMANDS.bal || command === CURRENCY_COMMANDS.balance) {
        getUserBalance(messageChannel);
    }
}
