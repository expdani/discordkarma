import {TypeMessageResponse} from "./../../types/response";
import {Message} from "discord.js";
import {sayUserKarma} from "./user/commands";
import {sayServerKarmaLeaderboard} from "./top/commands";
import {getSubCommand} from "./../../commandHandler";

/**
 * Setup the commands that are related to karma in the bot
 */
export async function setupKarmaCommands(message: Message, input: TypeMessageResponse) {
    const messageChannel = message.channel;
    if (messageChannel.type == "text" || messageChannel.type == "news") {
        const subCommand = await getSubCommand(input);

        if (subCommand) {
            switch (subCommand) {
                case "leaderboard":
                    sayServerKarmaLeaderboard(messageChannel);
            }
        } else {
            sayUserKarma(messageChannel, message);
        }
    }
}
