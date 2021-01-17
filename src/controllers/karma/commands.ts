import {Message, MessageEmbed, User} from "discord.js";
import {getKarma} from "./";
import {Channel} from "../../types/discord";
import {randomMsgs} from "../../../assets/random.json";

/**
 * The bot tells the user the amount of karma he has.
 */
async function sayUserKarma(channel: Channel, user: User) {
    try {
        const karma = await getKarma(user.id, channel.guild.id);
        const total = (karma && karma.total) || 0;
        const randomMsg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];

        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`, `${user.avatarURL()}`)
            .setDescription(`${randomMsg}, <@${user.id}>.`)
            .addField("Karmapunten", total, false)
            .setColor("#fffff");
        channel.send(embed);
    } catch (err) {
        channel.send("Oops, something went wrong while requesting your karma.");
    }
}

/**
 * Setup the commands that are related to karma in the bot
 */
export function setupKarmaCommands(message: Message) {
    const messageChannel = message.channel;
    if (messageChannel.type == "text" || messageChannel.type == "news") {
        sayUserKarma(messageChannel, message.author);
    }
}
