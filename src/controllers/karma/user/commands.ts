import {Message, MessageEmbed, User} from "discord.js";
import {getKarma} from "./../user";
import {randomMsgs} from "../../../../assets/random.json";
import {Command} from "../../../types/discord";
import {reply} from "../../../helpers";
import {TypeMessageResponse} from "../../../types/response";
import {getInteractionAttribute} from "../../../commandHandler";

/**
 * The bot tells the user the amount of karma he has.
 */
export async function sayUserKarma(command: Command, response: TypeMessageResponse) {
    try {
        const randomMsg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        const userId = command.member?.user.id;
        const targetUser =
            command instanceof Message ? command.mentions.users.first() : getInteractionAttribute(response, "user");
        const guildId = command.guildId;

        if (!userId || !guildId) return;

        if (targetUser && targetUser instanceof User) {
            const karma = await getKarma(targetUser?.id ?? userId, guildId);
            const total = (karma && karma.total) || 0;
            const embed = new MessageEmbed()
                .setAuthor(`${targetUser?.username}`, `${targetUser?.avatarURL() ?? "https://i.imgur.com/ZOKp8LH.jpg"}`)
                .addField("Karmapunten", total.toString(), false)
                .setColor("#fffff");
            reply(command, {embeds: [embed]});
        } else {
            const karma = await getKarma(userId as string, guildId);
            const total = (karma && karma.total) || 0;
            const embed = new MessageEmbed()
                .setAuthor(
                    `${command?.member?.user?.username}`,
                    `${(command?.member?.user as User).avatarURL() ?? "https://i.imgur.com/ZOKp8LH.jpg"}`,
                )
                .setDescription(`${randomMsg}, <@${userId}>.`)
                .addField("Karmapunten", total.toString(), false)
                .setColor("#fffff");
            reply(command, {embeds: [embed]});
        }
    } catch (err) {
        console.log(err);
        reply(command, "Oops, something went wrong requesting your karma.");
    }
}
