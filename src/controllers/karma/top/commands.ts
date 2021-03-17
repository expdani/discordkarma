import {MessageEmbed} from "discord.js";
import {getServerKarmaLeaderboard} from "./index";
import {Channel} from "../../../types/discord";

/**
 * Gets karma leaderboard of the server.
 */
export async function sayServerKarmaLeaderboard(channel: Channel) {
    try {
        const top = await getServerKarmaLeaderboard(channel.guild.id);
        const embed = new MessageEmbed().setTitle("Leaderboard").setColor("#fffff");
        let i = 0;
        top.forEach((karma) => {
            i++;
            embed.addField(`${karma.total} punten`, `${i}. <@${karma.userID}>`, true);
        });
        channel.send(embed);
    } catch (err) {
        channel.send("Oops, something went wrong requesting the leaderboard.");
    }
}
