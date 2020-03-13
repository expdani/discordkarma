import {client} from "../";
import {setupCurrencyCommands} from "../controllers/currency/commands";
import {COMMAND_PREFIX} from "../types/contants";
import setupMinigameCommands from "../controllers/minigames";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListeners() {
    client.on("message", (message) => {
        // Ignore the message if: it does not start with the command prefix
        //  or if it's send by another bot
        if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot) {
            return;
        }

        setupCurrencyCommands(message);
        setupMinigameCommands(message);
    });
}
