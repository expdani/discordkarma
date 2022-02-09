import {TypeChoices, TypeCommand} from "./types/response";
import {ApplicationCommandDataResolvable, Client, Guild} from "discord.js";
import {commands} from "../assets/commands.json";
import {items} from "../assets/items.json";

/**
 * Register all commands as slash command.
 */
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

/**
 * Get custom shop/buy inputs.
 */
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

/**
 * Get custom sell inputs.
 */
function getSellChoices(): TypeChoices[] {
    const choices: TypeChoices[] = [];
    items.forEach((item) => {
        choices.push({
            name: item.name,
            value: item.id,
        });
    });
    return choices;
}

/**
 * Setup custom choice inputs.
 */
function setupCustomOptions(command: TypeCommand) {
    if (command.text === "buy") {
        const shopChoises = getShopChoices();
        if (shopChoises != undefined) {
            command.options!.find((option) => option.name === "item")!.choices = getShopChoices();
        }
    }
    if (command.text === "sell") {
        const sellChoices = getSellChoices();
        if (sellChoices != undefined) {
            command.options!.find((option) => option.name === "item")!.choices = getSellChoices();
        }
    }
}
