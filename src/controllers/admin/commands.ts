import {Message} from "discord.js";
import {BOT_OWNER_ID} from "src/types/constants";

/**
 * Say command, making the bot repeat what you said and delete your message.
 */
export function sayCommand(message: Message) {
    if (BOT_OWNER_ID) {
        if (message.deletable) {
            message.delete();
        }
        message.channel.send(message.content.substr(message.content.indexOf(" ") + 1));
    }
}
