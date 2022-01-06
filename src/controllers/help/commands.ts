import {COMMAND_PREFIX} from "./../../types/constants";
import {Interaction, MessageEmbed, TextChannel} from "discord.js";
import {Command} from "../../types/discord";
import {commands} from "../../../assets/commands.json";
import {reply} from "../../helpers";

/**
 * The bot gives a list of commands.
 */
async function sayHelp(command: Command) {
    try {
        let description = "";
        const embed = new MessageEmbed().setTitle("Here's a list of commands you can use!").setColor("#fffff");
        commands.forEach((cmd) => {
            if (!cmd.show) return;
            let prefix = COMMAND_PREFIX;
            if (cmd.slash && command instanceof Interaction) prefix = "/";
            description += `**${prefix}${cmd.text}** - ${cmd.description}\n`;
            // command.sub?.forEach((sub: any) => {
            //     description += `**${COMMAND_PREFIX}${command.text} ${sub.text}** - ${sub.description}\n`;
            // });
            description += "\n";
        });
        embed.description = description;
        reply(command, {embeds: [embed]});
    } catch (err) {
        reply(command, "Oops, something went wrong requesting a list of the commands.");
    }
}

/**
 * Setup the command that are related to help in the bot
 */
export function setupHelpCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        sayHelp(command);
    }
}
