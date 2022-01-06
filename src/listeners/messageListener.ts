import {Message} from "discord.js";
import addKarmaReactions from "../controllers/karma/reactions";
import {client} from "../";
import {calculateInteractionResponse, calculateMessageResponse} from "../commandHandler";
import commandResolver from "../commandResolver";
import calculateRandomEvent from "../controllers/events/randomEvent";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListener() {
    client.on("messageCreate", async (message: Message) => {
        addKarmaReactions(message);

        const result = await calculateMessageResponse(message);

        if (result) {
            const resolver = commandResolver[result.command?.text.replace(" ", "_") || ""];

            if (resolver) {
                resolver(message, result);
            } else if (result.response) {
                message.channel.send(result.response);
            }
        }
        calculateRandomEvent(message);
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        const result = await calculateInteractionResponse(interaction);

        if (result) {
            const resolver = commandResolver[result.command?.text.replace(" ", "_") || ""];

            if (resolver) {
                resolver(interaction, result);
            }
        }
    });
}
