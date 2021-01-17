import {Message} from "discord.js";
import addKarmaReactions from "../controllers/karma/reactions";
import {client} from "../";
import {calculateResponse} from "../commandHandler";
import commandResolver from "../commandResolver";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListener() {
    client.on("message", async (message: Message) => {
        addKarmaReactions(message);

        const result = await calculateResponse(message);

        if (result) {
            const resolver = commandResolver[result.command?.text.replace(" ", "_") || ""];

            if (resolver) {
                resolver(message, result);
            } else if (result.response) {
                message.channel.send(result.response);
            }
        }
    });
}
