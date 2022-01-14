import {TypeMessageResponse} from "./../../../types/response";
import {TextChannel} from "discord.js";
import {Command} from "./../../../types/discord";
import {startGlassGame} from "./glass";
/**
 * Setup the command that are related to help in the bot
 */
export function setupGlassCommands(command: Command, _response: TypeMessageResponse) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        startGlassGame(command);
    }
}
