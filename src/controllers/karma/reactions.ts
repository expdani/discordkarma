import {Message, ReactionEmoji, User} from "discord.js";
import {changeKarma, initiateKarmaPost} from ".";

const UPVOTE = ["upvote", "👍"];
const DOWNVOTE = ["downvote", "👎"];

/**
 * Method that adds reactions to messages that contain a link or an attachment
 */
export default async function addKarmaReactions(message: Message) {
    if (message.content.includes("https://") || message.content.includes("http://") || message.attachments.size > 0) {
        try {
            const upvote = message?.guild?.emojis?.find((emoji) => emoji?.name === "upvote") || "👍";
            const downvote = message?.guild?.emojis?.find((emoji) => emoji?.name === "downvote") || "👎";

            await message.react(upvote);
            await message.react(downvote);
        } catch (error) {
            message.channel.send(error);
        }
    }
}

/**
 * Setup karma reaction events
 */
export async function setupKarmaReactions(message: Message, reaction: ReactionEmoji, user: User) {
    if (UPVOTE.includes(reaction.name)) {
        await changeKarma(message.author.id, message.guild.id, 1);
        await initiateKarmaPost(user.id, message.guild.id, message.id, message.author.id, "upvote");
    }
    if (DOWNVOTE.includes(reaction.name)) {
        await changeKarma(message.author.id, message.guild.id, -1);
        await initiateKarmaPost(user.id, message.guild.id, message.id, message.author.id, "downvote");
    }
}
