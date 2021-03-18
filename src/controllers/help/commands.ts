import {COMMAND_PREFIX} from "./../../types/constants";
import {Message, MessageEmbed} from "discord.js";
import {Channel} from "../../types/discord";
import {commands} from "../../../assets/commands.json";

/**
 * The bot tells the user the amount of money he has.
 */
async function sayHelp(channel: Channel) {
    try {
        let description = "";
        const embed = new MessageEmbed().setTitle("Here's a list of commands you can use!").setColor("#fffff");
        commands.forEach((command) => {
            if (!command.show) return;
            description += `**${COMMAND_PREFIX}${command.text}** - ${command.description}\n`;
            command.sub?.forEach((sub) => {
                description += `**${COMMAND_PREFIX}${command.text} ${sub.text}** - ${sub.description}\n`;
            });
            description += "\n";
        });
        embed.description = description;
        channel.send(embed);
    } catch (err) {
        channel.send("Oops, something went wrong requesting a list of the commands.");
    }
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupHelpCommands(message: Message) {
    const messageChannel = message.channel;

    if (messageChannel.type == "text" || messageChannel.type == "news") {
        sayHelp(messageChannel);
    }
}
