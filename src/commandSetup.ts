import {TypeChoices, TypeCommand} from "./types/response";
import {ApplicationCommandDataResolvable, Client, Guild} from "discord.js";
import {commands} from "../assets/commands.json";
import {items} from "../assets/items.json";

export default function registerCommands(client: Client) {
    let slashCommands: ApplicationCommandDataResolvable[] = [];
    commands.forEach((command: TypeCommand) => {
        if (command.slash) {
            setupCustomOptions(command);

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

function getShopChoices(): TypeChoices[] {
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

function setupCustomOptions(command: TypeCommand) {
    if (command.text === "buy") {
        const shopChoises = getShopChoices();
        if (shopChoises != undefined) {
            command.options!.find((option) => option.name === "item")!.choices = getShopChoices();
        }
    }
}
