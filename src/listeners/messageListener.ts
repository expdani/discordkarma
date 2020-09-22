import {Message} from "discord.js";
import {client} from "../";
import {calculateResponse} from "../commandHandler";
import commandResolver from "../commandResolver";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListener() {
    client.on("message", async (message: Message) => {
        const result = await calculateResponse(message);

        if (result) {
            const resolver = commandResolver[result.command?.text || ""];

            if (resolver) {
                resolver(message);
            }
        }
    });
}
