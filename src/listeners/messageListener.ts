import {Message} from "discord.js";
import {client} from "../";
import {calculateResponse} from "../commandHandler";
import commandResolver from "../commandResolver";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListener() {
    client.on("message", async (message: Message) => {
        const response = await calculateResponse(message);

        if (response) {
            const command = response.command?.command || "";
            const resolver = commandResolver[command];

            if (resolver) {
                resolver(message);
            } else {
                message.channel.send(response.response);
            }
        }
    });
}
