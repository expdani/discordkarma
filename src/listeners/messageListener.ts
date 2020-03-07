import {client} from "../";
// import {setupCurrencyCommands} from "../controllers/currency/commands";
import {calculateResponse} from "../commandHandler";

/**
 * Listener that listens to messages send in a server
 */
export default function setupMessageListeners() {
    client.on("message", async (message) => {
        const response = await calculateResponse(message);

        // TODO: do something based on response
        // setupCurrencyCommands(response);
    });
}
