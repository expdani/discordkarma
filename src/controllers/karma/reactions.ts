import {Message, MessageReaction, PartialUser, User} from "discord.js";
import {VOTE_ENUM} from "../../types/karma";
import {updateKarma, initiateKarmaPost, removeKarmaPost} from "./user/index";

const UPVOTE = ["upvote", "👍"];
const DOWNVOTE = ["downvote", "👎"];

/**
 * Method that adds reactions to messages that contain a link or an attachment
 */
export default async function addKarmaReactions(message: Message) {
    const content = message.content.toLowerCase();
    if (
        content.includes("https://") ||
        content.includes("http://") ||
        message.attachments.size > 0 ||
        content.startsWith("poll:") ||
        content.startsWith("referendum:") ||
        content.startsWith("petitie:")
    ) {
        try {
            const upvote = message?.guild?.emojis?.cache.find((emoji) => emoji?.name === "upvote") || "👍";
            const downvote = message?.guild?.emojis?.cache.find((emoji) => emoji?.name === "downvote") || "👎";

            await message.react(upvote);
            await message.react(downvote);
        } catch (error) {
            console.log(error);
        }
    }
}

/**
 * Setup karma reaction events
 */
export async function setupKarmaReactions(reaction: MessageReaction, user: User | PartialUser, type: string) {
    const message = reaction.message;
    if (!reaction.emoji.name) return;
    if (!message?.author?.id) return;
    if (UPVOTE.includes(reaction.emoji.name)) {
        await updateKarma(message.author.id, message.guild?.id ?? "", type === "add" ? 1 : -1);
        if (type === "add") {
            await initiateKarmaPost(user.id, message.guild?.id ?? "", message.id, message.author.id, VOTE_ENUM.UPVOTE);
        } else {
            await removeKarmaPost(user.id, message.guild?.id ?? "", message.id, message.author.id);
        }
    }
    if (DOWNVOTE.includes(reaction.emoji.name)) {
        await updateKarma(message.author.id, message.guild?.id ?? "", type === "add" ? -1 : 1);
        if (type === "add") {
            await initiateKarmaPost(
                user.id,
                message.guild?.id ?? "",
                message.id,
                message.author.id,
                VOTE_ENUM.DOWNVOTE,
            );
        } else {
            await removeKarmaPost(user.id, message.guild?.id ?? "", message.id, message.author.id);
        }
    }
}
