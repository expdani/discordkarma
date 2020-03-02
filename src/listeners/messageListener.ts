import {client} from "../";
import {setupCurrencyCommands} from "../controllers/currency/commands";
import {addEvent, useDialogflow} from "../controllers/dialogflow";
import {testDialog} from "../controllers/dialogflow/test";
import {COMMAND_PREFIX} from "../types/contants";

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

        // Array with every word that the user added to the command
        // The first item in the array is the command prefix + the command itself
        // all the others words are arguments that can be passed to the command
        const newMessage = {
            text: message.content.split(COMMAND_PREFIX, 2)[1],
            message,
        };

        setupCurrencyCommands(newMessage);

        addEvent(testDialog);
        useDialogflow(newMessage);
    });
}
