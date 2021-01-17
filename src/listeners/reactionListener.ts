import {Message, MessageReaction, ReactionEmoji, User} from "discord.js";
import {setupKarmaReactions} from "../controllers/karma/reactions";
import {KARMA_REACTIONS} from "../types/constants";
import {client} from "../";

/**
 * Listener that listens to reactions added or removed in a server
 */
export default function setupReactionListeners() {
    client.on("messageReactionAdd", async (message: Message, reaction: ReactionEmoji, user: User) => {
        if (KARMA_REACTIONS.includes(reaction?.emoji?.name)) {
            setupKarmaReactions(message, reaction, user);
        }
    });
    client.on("messageReactionRemove", async (message: Message, reaction: ReactionEmoji, user: User) => {
        if (KARMA_REACTIONS.includes(reaction?.emoji?.name)) {
            setupKarmaReactions(message, reaction, user);
        }
    });
}
