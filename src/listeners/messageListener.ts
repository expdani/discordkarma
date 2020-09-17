import {Message} from "discord.js";
import {client} from "../";
import {setupCurrencyCommands} from "../controllers/currency/commands";
import {calculateResponse} from "../commandHandler";
import setupMinigameCommands from "../controllers/minigames";

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
                case "trivia":
                    setupMinigameCommands(message);
                    break;
                default:
                    message.channel.send(response.response);
                break;
            }
        }
    });
}
