import {MessageEmbed} from "discord.js";
import {Command} from "./../../../types/discord";
import database from "../../../database";
import {TypeKarmaTotal} from "src/types/karma";
import {reply} from "../../../helpers";

/**
 * Gets karma leaderboard of the server.
 */
export async function sayServerKarmaLeaderboard(command: Command) {
    try {
        if (!command.guildId) return;
        const top = await getServerKarmaLeaderboard(command.guildId);
        const embed = new MessageEmbed().setTitle("Leaderboard").setColor("#fffff");
        let i = 0;
        top.forEach((karma) => {
            i++;
            embed.addField(`${karma.total} punten`, `${i}. <@${karma.userID}>`, true);
        });
        reply(command, {embeds: [embed]});
    } catch (err) {
        reply(command, "Oops, something went wrong requesting the leaderboard.");
    }
}

/**
 * Get server leaderboard
 */
export async function getServerKarmaLeaderboard(serverID: string): Promise<TypeKarmaTotal[]> {
    const top = await database("karma_total").where({serverID}).orderBy("total", "desc").limit(10);
    return top;
}
