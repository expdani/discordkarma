import {Command} from "./../../types/discord";
import {reply} from "../../helpers";
import {addItemToInventory} from "../inventory";
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
