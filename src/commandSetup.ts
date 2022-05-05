/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {TypeChoices, TypeCommand} from "./types/response";
import {ApplicationCommandDataResolvable, Client, Guild} from "discord.js";
import {commands} from "../assets/commands.json";
import {getItemShop} from "./controllers/shop";

/**
 * Register all commands as slash command.
 */
export default function registerCommands(client: Client) {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
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
async function getShopChoices(): Promise<TypeChoices[]> {
    const choices: TypeChoices[] = [];

    const items = await getItemShop();
    items.forEach((item: any) => {
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
async function getSellChoices(): Promise<TypeChoices[]> {
    const choices: TypeChoices[] = [];

    const items = await getItemShop();
    items.forEach((item: any) => {
        if (item.shop)
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
async function setupCustomOptions(command: TypeCommand) {
    if (command.text === "buy") {
        const shopChoises = await getShopChoices();
        if (shopChoises != undefined) {
            command.options!.find((option) => option.name === "item")!.choices?.push(...shopChoises);
        }
    }

    if (command.text === "sell") {
        const sellChoices = await getSellChoices();
        if (sellChoices != undefined) {
            sellChoices.forEach((choice: TypeChoices) => {
                command.options!.find((option) => option.name === "item")!.choices?.push(choice);
            });
        }
    }
}
