import {TypeMessageResponse} from "./../../types/response";
import {Message} from "discord.js";
import {sayUserKarma} from "./user/commands";
import {sayKarmaServerTop} from "./top/commands";

/**
 * Setup the commands that are related to karma in the bot
 */
export function setupKarmaCommands(message: Message, response: TypeMessageResponse) {
    const messageChannel = message.channel;
    let subCommand;
    if (messageChannel.type == "text" || messageChannel.type == "news") {
        if (response.command?.sub && response.input.attributes.length > 0) {
            const attribute = response.input.attributes[0];
            response.command.sub.forEach((sub) => {
                if (sub.aliases?.includes(attribute)) {
                    subCommand = sub.text;
                }
            });
        }

        if (subCommand) {
            switch (subCommand) {
                case "leaderboard":
                    sayKarmaServerTop(messageChannel);
            }
        } else {
            sayUserKarma(messageChannel, message);
        }
    }
}
