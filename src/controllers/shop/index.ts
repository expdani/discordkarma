import {Command} from "./../../types/discord";
import {reply} from "../../helpers";
import {addItemToInventory, getItem} from "../inventory";
import {changeCurrency, getCurrency} from "../currency";
import {items} from "../../../assets/items.json";

/**
 * Buy an item from the shop.
 */
export async function buyItem(command: Command, item: string, amount: any) {
    try {
        const user = command.member?.user;
        if (!user) return;
        const balance = await getCurrency(user.id);
        const shopItem = items.find(
            (x) => x.id.toLowerCase() === item.toLowerCase() || x.name.toLowerCase() === item.toLowerCase(),
        );

        amount = parseInt(amount);
        if (!amount) amount = 1;

        if (shopItem && shopItem.shop) {
            const newBalance = balance.wallet - shopItem.price * amount;
            if (newBalance >= 0) {
                await changeCurrency(user.id, -(shopItem.price * amount));
                await addItemToInventory(user.id, shopItem.id, amount);
                reply(command, `You have bought ${amount} ${shopItem.emoji} ${shopItem.name}!`);
            } else reply(command, "You don't have enough money in your wallet..");
        } else {
            reply(command, "That item is not for sale.");
        }
    } catch (err) {
        reply(command, "Oops, something went wrong processing your purchase.");
    }
}

/**
 * Sell an item.
 */
export async function sellItem(command: Command, item: string, amount: any) {
    try {
        const user = command.member?.user;
        if (!user) return;
        const shopItem: any = items.find(
            (x) => x.id.toLowerCase() === item.toLowerCase() || x.name.toLowerCase() === item.toLowerCase(),
        );

        const sellItem = await getItem(user.id, shopItem.id);

        amount = parseInt(amount);
        if (!amount) amount = 1;

        if (shopItem) {
            if (sellItem && amount <= sellItem.amount) {
                await addItemToInventory(user.id, shopItem.id, -amount);
                await changeCurrency(user.id, shopItem.sell ? shopItem.sell * amount : (shopItem.price * amount) / 2);
                reply(command, `You have sold ${amount} ${shopItem.emoji} ${shopItem.name}!`);
            } else reply(command, "You don't have enough of this item..");
        } else {
            reply(command, "That is not a valid item.");
        }
    } catch (err) {
        reply(command, "Oops, something went wrong processing your transaction.");
    }
}
