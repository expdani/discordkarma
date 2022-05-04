import {MessageEmbed} from "discord.js";
import {Command} from "./../../../types/discord";
import {reply} from "../../../helpers";
import {apolloClient} from "../../../apollo";
import {GET_SERVER_KARMA_LEADERBOARD} from "../gql";
import {TypeKarmaTotal} from "../../../types/karma";

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
            embed.addField(`${karma.total} punten`, `${i}. <@${karma.user_id}>`, true);
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
    const {data} = await apolloClient.query({
        query: GET_SERVER_KARMA_LEADERBOARD,
        variables: {server_id: serverID},
    });

    return data.getServerLeaderboard;
}
