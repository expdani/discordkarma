import {Message} from "discord.js";
import {COMMAND_PREFIX} from "./types/constants";
import {TypeCommand} from "./types/response";
import {commands} from "../assets/commands.json";
import {useDialogflow} from "./controllers/dialogflow";

/**
 * Check if command is een regsitered command
 */
function getCommand(command: string) {
    return commands.find((input: TypeCommand) => {
        const {text, aliases, intent} = input;

        // Find command based on "name", aliases or intent
        if (text === command || aliases?.includes(command) || intent === command) {
            return input;
        }
    });
}

/**
 * Calculate response
 */
export async function calculateResponse(message: Message) {
    // Ignore the message if: it does not start with the command prefix
    // or if it's send by another bot
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot) {
        return;
    }

    // Array with every word that the user added to the command
    // The first item in the array is the command prefix + the command itself
    // all the others words are arguments that can be passed to the command
    const fullCommand = message.content.split(COMMAND_PREFIX, 2)[1];

    // Seperate command and attributes
    const comandWithAttributes = fullCommand.split(" ");
    const commandText = comandWithAttributes[0];
    const attributes = comandWithAttributes.slice();

    // Remove the first element from attributes (the command)
    attributes.shift();

    let command = getCommand(commandText);
    let parameters;
    let response;

    if (!command && process.env.DIALOGFLOW_PROJECT_ID) {
        const data = await useDialogflow(fullCommand);
        const {queryResult} = data[0];

        if (queryResult.intent) {
            command = getCommand(queryResult.intent.displayName);
            response = queryResult.fulfillmentText;
            parameters = queryResult.parameters;
        }
    }

    return {
        input: {
            text: commandText,
            attributes,
            fullCommand,
        },
        parameters,
        response,
        command,
    };
}
