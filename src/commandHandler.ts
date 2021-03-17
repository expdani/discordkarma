import {Message} from "discord.js";
import {COMMAND_PREFIX} from "./types/constants";
import {TypeCommand, TypeMessageResponse} from "./types/response";
import {commands} from "../assets/commands.json";
import {useDialogflow} from "./controllers/dialogflow";

/**
 * Check if command is een regsitered command
 */
function getCommand(command: string, fullCommand: string) {
    return commands.find((input: TypeCommand) => {
        const {text, aliases, intent} = input;

        // Find command based on "text", "full command (including args)", aliases or intent
        if (
            intent === command.toLocaleLowerCase() ||
            text === command.toLocaleLowerCase() ||
            text === fullCommand.toLocaleLowerCase() ||
            aliases?.includes(command.toLocaleLowerCase())
        ) {
            return input;
        }
    });
}

/**
 * Checks if argumant is a registered subcommand in the main command and returns it.
 */
export async function getSubCommand(response: TypeMessageResponse) {
    let subCommand = null;
    if (response.command?.sub && response.input.attributes.length > 0) {
        const attribute = response.input.attributes[0];
        response.command.sub.forEach((sub) => {
            if (sub.aliases?.includes(attribute.toLocaleLowerCase())) {
                subCommand = sub.text;
            }
        });
    }
    return subCommand;
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

    let command;
    let parameters;
    let response;

    if (process.env.DIALOGFLOW_PROJECT_ID) {
        const data = await useDialogflow(fullCommand);
        const {queryResult} = data[0];

        if (queryResult.intent) {
            command = getCommand(queryResult.intent.displayName, fullCommand);
            response = queryResult.fulfillmentText;
            parameters = queryResult.parameters;
        }
    }

    if (!command) {
        command = getCommand(commandText, fullCommand);
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
