import {Message} from "discord.js";
import {sayUserKarma} from "./user/commands";
import {sayKarmaServerTop} from "./top/commands";

/**
 * Setup the commands that are related to karma in the bot
 */
export function sayKarmaCommand(message: Message) {
    const messageChannel = message.channel;
    if (messageChannel.type == "text" || messageChannel.type == "news") {
        sayUserKarma(messageChannel, message);
    }
}

/**
 * Setup the commands that are related to karma in the bot
 */
export function sayTopCommand(message: Message) {
    const messageChannel = message.channel;
    if (messageChannel.type == "text" || messageChannel.type == "news") {
        sayKarmaServerTop(messageChannel);
    }
}
