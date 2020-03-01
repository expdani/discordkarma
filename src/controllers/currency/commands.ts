import {Message} from "discord.js";
import {getUserBalance} from "./";
import {CURRENCY_COMMANDS} from "../../types/commands/currency";

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(message: Message) {
    const messageChannel = message.channel;

    // Array with every word that the user added to the command
    // The first item in the array is the command prefix + the command itself
    // all the others words are arguments that can be passed to the command
    const wordsInCommand = message.content.split(" ");
    const command = wordsInCommand[0].substr(1, wordsInCommand[0].length + 1); // Remove the command prefix
    // const commandArgs = wordsInCommand.length > 1 ? wordsInCommand.slice(1, wordsInCommand.length + 1) : undefined;

    console.log(command);

    if (command === CURRENCY_COMMANDS.bal || command === CURRENCY_COMMANDS.balance) {
        getUserBalance(messageChannel);
    }
}
