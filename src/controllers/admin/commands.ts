import {Message} from "discord.js";
import {env} from "../../../environment";

/**
 * Say command
 */
export function sayCommand(message: Message) {
    if (message.author.id === env.BOT_OWNER_ID) {
        if (message.deletable) {
            message.delete();
        }
        message.channel.send(message.content.substr(message.content.indexOf(" ") + 1));
    }
}
