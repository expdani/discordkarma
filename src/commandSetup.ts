import {ApplicationCommandDataResolvable, Client, Guild} from "discord.js";
import {commands} from "../assets/commands.json";

export default function registerCommands(client: Client) {
    let slashCommands: ApplicationCommandDataResolvable[] = [];
    commands.forEach((command) => {
        if (command.slash) {
            slashCommands.push({
                name: command.text,
                description: command.description,
                options: command.options,
            });
        }
    });

    try {
        client.guilds.cache.forEach((guild: Guild) => {
            guild.commands.set(slashCommands);
        });
    } catch (error) {
        console.log(error);
    }
    client.application?.commands?.set([]);
}
