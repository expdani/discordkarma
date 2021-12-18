import {COMMAND_PREFIX} from "./../../types/constants";
import {MessageEmbed, TextChannel} from "discord.js";
import {Channel, Command} from "../../types/discord";
import {commands} from "../../../assets/commands.json";

/**
 * The bot gives a list of commands.
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
        channel.send({embeds: [embed]});
    } catch (err) {
        channel.send("Oops, something went wrong requesting a list of the commands.");
    }
}

/**
 * Setup the command that are related to help in the bot
 */
export function setupHelpCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        sayHelp(messageChannel);
    }
}
