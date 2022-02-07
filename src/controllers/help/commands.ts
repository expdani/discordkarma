import {TextChannel} from "discord.js";
import {Command} from "../../types/discord";
import {sayHelp} from ".";

/**
 * Setup the command that are related to help in the bot
 */
export function setupHelpCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        sayHelp(command);
    }
}
