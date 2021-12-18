import {Command} from "../../types/discord";
import {BOT_OWNER_ID} from "../../types/constants";
import {Message} from "discord.js";

/**
 * Say command, making the bot repeat what you said and delete your message.
 */
export function sayCommand(command: Command) {
    if (!(command instanceof Message)) return;
    if (BOT_OWNER_ID) {
        if (command.deletable) {
            command.delete();
        }
        command.channel.send(command.content.substr(command.content.indexOf(" ") + 1));
    }
}
