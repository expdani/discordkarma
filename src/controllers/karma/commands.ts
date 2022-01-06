import {TypeMessageResponse} from "./../../types/response";
import {TextChannel} from "discord.js";
import {sayUserKarma} from "./user/commands";
import {Command} from "../../types/discord";
import {sayServerKarmaLeaderboard} from "./top/index";

/**
 * Setup the commands that are related to karma in the bot
 */
export async function setupKarmaCommands(command: Command, input: TypeMessageResponse) {
    if (command.channel instanceof TextChannel) {
        sayUserKarma(command, input);
    }
}

/**
 * Setup the commands that are related to karma in the bot
 */
export async function setupTopCommands(command: Command) {
    if (command.channel instanceof TextChannel) {
        sayServerKarmaLeaderboard(command);
    }
}
