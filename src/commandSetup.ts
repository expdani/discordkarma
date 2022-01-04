import {TypeChoices, TypeCommand} from "./types/response";
import {ApplicationCommandDataResolvable, Client, Guild} from "discord.js";
import {commands} from "../assets/commands.json";
import {items} from "../assets/items.json";

export default function registerCommands(client: Client) {
    let slashCommands: ApplicationCommandDataResolvable[] = [];
    commands.forEach((command: TypeCommand) => {
        if (command.slash) {
            if (command.text === "buy") {
                const shopChoises = getShopChoices();
                if (shopChoises != undefined) {
                    let choices = command.options?.find((cmd) => {
                        cmd.name === "item";
                    })?.choices;

                    shopChoises.forEach((choice) => {
                        choices?.push(choice);
                    });
                }
            }
            slashCommands.push({
                name: command.text,
                description: command.description,
                options: command.options,
            });
            console.log(command);
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

export function getShopChoices(): TypeChoices[] {
    const choices: TypeChoices[] = [];
    items.forEach((item) => {
        if (item.shop)
            choices.push({
                name: item.name,
                value: item.id,
            });
    });
    return choices;
}
