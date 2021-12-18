import {TypeMessageResponse} from "./../../types/response";
import {TextChannel} from "discord.js";
import {sayUserKarma} from "./user/commands";
import {sayServerKarmaLeaderboard} from "./top/commands";
import {getSubCommand} from "./../../commandHandler";
import {Command} from "../../types/discord";

/**
 * Setup the commands that are related to karma in the bot
 */
export async function setupKarmaCommands(command: Command, input: TypeMessageResponse) {
    const messageChannel = command.channel;
    if (messageChannel instanceof TextChannel) {
        const subCommand = await getSubCommand(input, 0);
        if (subCommand) {
            switch (subCommand) {
                case "leaderboard":
                    sayServerKarmaLeaderboard(messageChannel);
            }
        } else {
            sayUserKarma(command, input);
        }
    }
}
