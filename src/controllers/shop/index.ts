import {addItemToInventory} from "../inventory";
import {Message} from "discord.js";
import {changeCurrency, getCurrency} from "../currency";
import {items} from "../../../assets/items.json";

/**
 * Buy an item from the shop.
 */
export async function buyItem(message: Message, item: any, amount: any) {
    const channel = message.channel;
    try {
        const userID = message.author.id;
        const balance = await getCurrency(userID);
        const shopItem = items.find(
            (x) => x.id.toLowerCase() === item.toLowerCase() || x.name.toLowerCase() === item.toLowerCase(),
        );

        if (!amount) amount = 1;

        if (shopItem && shopItem.shop) {
            const newBalance = balance.wallet - shopItem.price * amount;
            if (newBalance >= 0) {
                await changeCurrency(userID, -(shopItem.price * amount));
                await addItemToInventory(userID, shopItem.id, amount);
                channel.send(`U hebt ${amount} ${shopItem.emoji} ${shopItem.name} gekocht!`);
            }
        } else {
            channel.send("That item is not for sale.");
        }
    } catch (err) {
        channel.send("Oops, something went wrong processing your purchase.");
    }
}
