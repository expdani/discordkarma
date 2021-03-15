import {Message, MessageEmbed} from "discord.js";
import {getKarma} from "./../user";
import {Channel} from "../../../types/discord";
import {randomMsgs} from "../../../../assets/random.json";

/**
 * The bot tells the user the amount of karma he has.
 */
export async function sayUserKarma(channel: Channel, message: Message) {
    try {
        const randomMsg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];

        if (message.mentions.users.first()) {
            const user = message.mentions.users.first();
            const karma = await getKarma(user?.id ?? message.author.id, channel.guild.id);
            const total = (karma && karma.total) || 0;
            const embed = new MessageEmbed()
                .setAuthor(`${user?.username}`, `${user?.avatarURL() ?? "https://i.imgur.com/ZOKp8LH.jpg"}`)
                .addField("Karmapunten", total, false)
                .setColor("#fffff");
            channel.send(embed);
        } else {
            const karma = await getKarma(message.author.id, channel.guild.id);
            const total = (karma && karma.total) || 0;
            const embed = new MessageEmbed()
                .setAuthor(
                    `${message.author.username}`,
                    `${message.author.avatarURL() ?? "https://i.imgur.com/ZOKp8LH.jpg"}`,
                )
                .setDescription(`${randomMsg}, <@${message.author.id}>.`)
                .addField("Karmapunten", total, false)
                .setColor("#fffff");
            channel.send(embed);
        }
    } catch (err) {
        channel.send("Oops, something went wrong while requesting your karma.");
    }
}
