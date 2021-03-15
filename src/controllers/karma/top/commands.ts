import {MessageEmbed} from "discord.js";
import {getKarmaServerTop} from "./../user";
import {Channel} from "../../../types/discord";

/**
 * Gets karma leaderboard of the server.
 */
export async function sayKarmaServerTop(channel: Channel) {
    try {
        const top = await getKarmaServerTop(channel.guild.id);
        const embed = new MessageEmbed().setTitle("Leaderboard").setColor("#fffff");
        let i = 0;
        top.forEach((karma) => {
            i++;
            embed.addField(`${karma.total} punten`, `${i}. <@${karma.userID}>`, true);
        });
        channel.send(embed);
    } catch (err) {
        channel.send("Oops, something went wrong while requesting the leaderboard.");
        console.log(err);
    }
}
