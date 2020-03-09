import {Message} from "discord.js";
import {client} from "../";
import {setupCurrencyCommands} from "../controllers/currency/commands";
import {calculateResponse} from "../commandHandler";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListeners() {
    client.on("message", async (message: Message) => {
        const response = await calculateResponse(message);

        if (response) {
            switch (response.command?.command) {
                case "bal":
                    setupCurrencyCommands(message);
                    break;
                default:
                    message.channel.send(response.response);
            }
        }
    });
}
