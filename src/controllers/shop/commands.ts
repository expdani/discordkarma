import {CURRENCY_SIGN} from "./../../types/currency";
import {MessageEmbed, TextChannel} from "discord.js";
import {Channel, Command} from "../../types/discord";
import {TypeMessageResponse} from "src/types/response";
import {buyItem, getItemShop, sellItem} from ".";
import {shopMsgs} from "../../../assets/random.json";
import {reply} from "../../helpers";
import {getInteractionAttribute, getMessageAttribute} from "../../commandHandler";

/**
 * The bot tells the user the amount of money he has.
 */
async function sayShop(channel: Channel) {
    try {
        let description = "";
        const shop = await getItemShop();
        const shopMsg = shopMsgs[Math.floor(Math.random() * shopMsgs.length)];
        const embed = new MessageEmbed().setTitle(`${shopMsg}`).setColor("#fffff");
        shop.forEach((item: any) => {
            description += `**${item.emoji} ${item.name}** — ${CURRENCY_SIGN}${item.price} \n ${item.description}\n\n`;
        });
        embed.description = description;
        channel.send({embeds: [embed]});
    } catch (err) {
        console.log(err);
        channel.send("Oops, something went wrong requesting the shop.");
    }
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupShopCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        sayShop(messageChannel);
    }
}

/**
 * Setup the command that are related to buying in the bot
 */
export function setupBuyCommands(command: Command, result: TypeMessageResponse) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        if (result.input.attributes.length < 1) {
            reply(command, "To buy an item, use `?buy (item name)`.");
        } else {
            const item = getInteractionAttribute(result, "item")
                ? getInteractionAttribute(result, "item")
                : getMessageAttribute(result, 0);

            const amount = getInteractionAttribute(result, "amount")
                ? getInteractionAttribute(result, "amount")
                : getMessageAttribute(result, 1);
            buyItem(command, item as string, amount as string);
        }
    }
}

/**
 * Setup the command that are related to selling items in the bot
 */
export function setupSellCommands(command: Command, result: TypeMessageResponse) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        if (result.input.attributes.length < 1) {
            reply(command, "To sell an item, use `?sell (item name)`.");
        } else {
            const item = getInteractionAttribute(result, "item")
                ? getInteractionAttribute(result, "item")
                : getMessageAttribute(result, 0);

            const amount = getInteractionAttribute(result, "amount")
                ? getInteractionAttribute(result, "amount")
                : getMessageAttribute(result, 1);
            sellItem(command, item as string, amount as string);
        }
    }
}
