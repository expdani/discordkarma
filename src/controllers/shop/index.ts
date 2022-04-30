import {Command} from "./../../types/discord";
import {reply} from "../../helpers";
import {BUY_ITEM, GET_ITEM_SHOP} from "./gql";
import {apolloClient} from "../../apollo/index";
import getErrorMessage from "../../apollo/errors";

/**
 * Buy an item from the shop.
 */
export async function buyItem(command: Command, item: string, amount?: any) {
    try {
        const user = command.member?.user;
        if (!user) return reply(command, "You must be a member of this server to use this command.");

        const {data} = await apolloClient.mutate({
            mutation: BUY_ITEM,
            variables: {user_id: user.id, item, amount},
        });

        const shopItem = data.buyItem;

        reply(command, `You have bought ${amount}x ${shopItem.emoji} ${shopItem.name}!`);
    } catch (err: any) {
        console.log(err.graphQLErrors[0]?.message);
        reply(command, getErrorMessage(err.graphQLErrors[0]?.message));
    }
}

/**
 * Sell an item.
 */
export async function sellItem(command: Command, item: string, amount: any) {
    try {
        const user = command.member?.user;
        if (!user) return reply(command, "You must be a member of this server to use this command.");

        const {data} = await apolloClient.mutate({
            mutation: BUY_ITEM,
            variables: {user_id: user.id, item, amount},
        });

        const shopItem = data.buyItem;

        reply(command, `You have sold ${amount}x ${shopItem.emoji} ${shopItem.name}!`);
    } catch (err: any) {
        console.log(err.graphQLErrors[0]);
        reply(command, getErrorMessage(err.graphQLErrors[0]?.message));
    }
}

/**
 * Get server shop.
 */
export async function getItemShop() {
    const {data} = await apolloClient.query({
        query: GET_ITEM_SHOP,
        // variables: {user_id},
    });
    return data.getItemShop;
}
