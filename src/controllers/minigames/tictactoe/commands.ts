import {TypeMessageResponse} from "./../../../types/response";
import {TextChannel} from "discord.js";
import {Command} from "./../../../types/discord";
import {initiateTicTacToe} from "./tictactoe";
/**
 * Setup the command that are related to help in the bot
 */
export function setupTictactoeCommands(command: Command, response: TypeMessageResponse) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        initiateTicTacToe(command, response);
    }
}
