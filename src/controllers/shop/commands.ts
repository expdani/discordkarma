import {CURRENCY_SIGN} from "./../../types/currency";
import {MessageEmbed, TextChannel} from "discord.js";
import {Channel, Command} from "../../types/discord";
import {items} from "../../../assets/items.json";
import {TypeMessageResponse} from "src/types/response";
import {buyItem} from ".";
import {shopMsgs} from "../../../assets/random.json";
import {reply} from "../../helpers";
import {getInteractionAttribute, getMessageAttribute} from "../../commandHandler";

/**
 * The bot tells the user the amount of money he has.
 */
async function sayShop(channel: Channel) {
    try {
        let description = "";
        const shopMsg = shopMsgs[Math.floor(Math.random() * shopMsgs.length)];
        const embed = new MessageEmbed().setTitle(`${shopMsg}`).setColor("#fffff");
        items.forEach((item) => {
            description += `**${item.emoji} ${item.name}** — ${CURRENCY_SIGN}${item.price} \n ${item.description}\n\n`;
        });
        embed.description = description;
        channel.send({embeds: [embed]});
    } catch (err) {
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
            console.log(getMessageAttribute(result, 0));

            const amount = getInteractionAttribute(result, "amount")
                ? getInteractionAttribute(result, "amount")
                : getMessageAttribute(result, 1);
            buyItem(command, item as string, amount as string);
        }
    }
}

// /**
//  * Setup the command that are related to selling in the bot
//  */
// export function setupSellCommands(command: Command, result: TypeMessageResponse) {
//     const messageChannel = command.channel;

//     if (messageChannel instanceof TextChannel) {
//         if (result.input.attributes.length < 1) {
//             messageChannel.send("To buy an item, use `?buy (item name)`.");
//         }
//     }
// }
