import {setupKarmaReactions} from "../controllers/karma/reactions";
import {KARMA_REACTIONS} from "../types/constants";
import {client} from "../";
import {MessageReaction, PartialUser, User} from "discord.js";
import {getServerSettings} from "../controllers/settings";

/**
 * Listener that listens to reactions added or removed in a server
 */
export default function setupReactionListeners() {
    client.on("messageReactionAdd", async (reaction, user) => {
        // When we receive a reaction we check if the reaction is partial or not
        if (reaction.partial) {
            // If the message this reaction belongs to was removed the fetching
            // might result in an API error, which we need to handle
            try {
                await reaction.fetch();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Something went wrong when fetching the message: ", error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if (!(reaction instanceof MessageReaction)) return;

        if (await requiresSetup(reaction, user)) {
            setupKarmaReactions(reaction, user, "add");
        }
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.partial) {
            // When we receive a reaction we check if the reaction is partial or not
            // If the message this reaction belongs to was removed the fetching
            // might result in an API error, which we need to handle
            try {
                await reaction.fetch();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Something went wrong when fetching the message: ", error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if (!(reaction instanceof MessageReaction)) return;

        if (await requiresSetup(reaction, user)) {
            setupKarmaReactions(reaction, user, "remove");
        }
    });
}

/**
 * Checks if the action requires setupKarmaReactions
 */
async function requiresSetup(reaction: MessageReaction, user: User | PartialUser) {
    if (!reaction?.message?.guild?.id) return false;
    const settings = await getServerSettings(reaction?.message?.guild?.id);
    if (!settings.karma_enabled) return;

    if (!reaction.emoji.name || !reaction.message.author) return false;
    if (KARMA_REACTIONS.includes(reaction.emoji.name) && user.id !== reaction.message.author.id) {
        return true;
    }
    return false;
}
