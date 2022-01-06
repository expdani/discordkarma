import {Command} from "./types/discord";
import {Interaction, Message, User} from "discord.js";
import {COMMAND_PREFIX} from "./types/constants";
import {TypeCommand, TypeMessageResponse} from "./types/response";
import {commands} from "../assets/commands.json";
// import {useDialogflow} from "./controllers/dialogflow";

/**
 * Check if command is een regsitered command
 */
function getCommand(command: string) {
    return commands.find((input: TypeCommand) => {
        const {text, aliases, intent} = input;

        // Find command based on "text", "full command (including args)", aliases or intent
        if (
            intent === command.toLowerCase() ||
            text.toLowerCase() === command.toLowerCase() ||
            aliases?.includes(command.toLowerCase())
        ) {
            return input;
        }
    });
}

/**
 * Checks if attribute is a registered subcommand in the main command and returns it.
 */
export function getMessageSubCommand(response: TypeMessageResponse, index: number) {
    let subCommand = null;

    if (response.command?.sub && response.input.attributes.length > 0) {
        const attribute = response.input.attributes[index] as String;
        response.command.sub.forEach((sub) => {
            if (attribute instanceof String && sub.aliases?.includes(attribute.toLowerCase())) {
                subCommand = sub.text;
            }
        });
    }
    return subCommand;
}

/**
 * Checks if attribute is a registered subcommand in the main command and returns it.
 */
export function getInteractionSubCommand(command: Command) {
    if (!(command instanceof Interaction)) return;
    if (!command.isCommand()) return;

    return command.options.getSubcommand();
}

/**
 * Returns the attribute with the given index.
 */
export function getMessageAttribute(response: TypeMessageResponse, index: number): string | null {
    if (response.input.attributes && response.input.attributes[index]) {
        return response.input.attributes[index] as string;
    }
    return null;
}

/**
 * Returns the attribute with the given name.
 */
export function getInteractionAttribute(response: TypeMessageResponse, name: string): string | null | User {
    const attribute = (response.input.attributes as any[]).find((x) => x.name === name);

    if (!attribute) return null;

    switch (attribute.type) {
        case "USER":
            return attribute.user as User;
        default:
            return attribute.value;
    }
}

/**
 * Calculate response
 */
export async function calculateMessageResponse(message: Message) {
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
        // const data = await useDialogflow(fullCommand);
        // const {queryResult} = data[0];
        // if (queryResult.intent) {
        //     command = getCommand(queryResult.intent.displayName);
        //     response = queryResult.fulfillmentText;
        //     parameters = queryResult.parameters;
        // }
    }

    if (!command) {
        command = getCommand(commandText);
    }

    return {
        input: {
            text: commandText,
            attributes,
        },
        parameters,
        response,
        command,
    };
}

export async function calculateInteractionResponse(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    // Ignore the message if:
    // or if it's send by another bot
    if (interaction.user.bot) return;

    // // Seperate command and attributes
    const commandText = interaction.commandName;
    const attributes = interaction.options.data;

    const command = getCommand(commandText);

    return {
        input: {
            text: commandText,
            attributes,
        },
        command,
    };
}
