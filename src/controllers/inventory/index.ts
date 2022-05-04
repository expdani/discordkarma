import {apolloClient} from "../../apollo/index";
import {TypeInventory, TypeInventoryItem} from "src/types/inventory";
import {ADD_ITEM_TO_INVENTORY, GET_INVENTORY} from "./gql";

/**
 * Edit the inventory of the user.
 * - A positive number adds the items to the user
 * - A negative number removes the items from the user
 */
export async function addItemToInventory(user_id: string, item: string, amount: number) {
    const fixedAmount = parseFloat(amount?.toFixed(2));

    const {data} = await apolloClient.mutate({
        mutation: ADD_ITEM_TO_INVENTORY,
        variables: {user_id, item, amount: fixedAmount},
    });

    return data.addItemToInventory;
}

/**
 * Get a specific item from the user's inventory.
 */
export async function getItem(user_id: string, _item: string): Promise<TypeInventoryItem | null> {
    const inv: TypeInventory | undefined = await getInventory(user_id);
    if (!inv) return null;
    const invJson = JSON.parse(inv.inventory);
    const item = await invJson.items.find((item: TypeInventoryItem) => item.id === _item);

    return item;
}

/**
 * Get the inventory for the user
 */
export async function getInventory(user_id: string): Promise<TypeInventory | undefined> {
    try {
        const {data} = await apolloClient.query({
            query: GET_INVENTORY,
            variables: {user_id},
        });
        return data.getInventory;
    } catch (err) {
        console.log(err);
    }
}
