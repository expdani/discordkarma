import {Message} from "discord.js";
import {COMMAND_PREFIX} from "./types/contants";
import {commands} from "../assets/commands.json";
import {useDialogflow} from "./controllers/dialogflow";

/**
 * Check if command is een regsitered command
 */
function getCommand(text: string) {
    return commands.find((cmd) => {
        const {command, aliases, intent} = cmd;

        if (command === text || (aliases && aliases.includes(text)) || intent === text) {
            return cmd;
        }
    });
}

// TODO: type response
/**
 * Calculate response
 */
export async function calculateResponse(message: Message) {
    // Ignore the message if: it does not start with the command prefix
    //  or if it's send by another bot
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

    let response = {
        input: {
            text: commandText,
            attributes,
            fullCommand,
        },
        response: "",
    };

    let command = getCommand(commandText);

    if (!command) {
        const data = await useDialogflow(fullCommand);
        const {queryResult} = data[0];

        if (queryResult) {
            command = getCommand(queryResult.intent.displayName);
            response.response = queryResult.fulfillmentText;
            response = Object.assign(response, {parameters: queryResult.parameters});
        }
    }

    if (command) {
        response = Object.assign(response, {command});
    }

    return response;
}
