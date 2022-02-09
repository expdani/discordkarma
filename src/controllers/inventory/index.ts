import {TypeInventory, TypeInventoryItem} from "src/types/inventory";
import database from "../../database/index";

/**
 * Edit the inventory of the user.
 * - A positive number adds the items to the user
 * - A negative number removes the items from the user
 */
export async function addItemToInventory(userID: string, item: string, amount: number) {
    // Make sure item is in lowercase
    item = item.toLowerCase();

    // Date now used to update updated_at in the query.
    const now = new Date();

    // Check if the user has an inventory, else create it.
    let inventory = JSON.parse((await getInventory(userID)).inventory);
    if (!inventory) {
        inventory = JSON.parse((await initiateInventory(userID)).inventory);
    }

    // Create an array if the inventory has no items yet.
    if (!inventory.items) {
        inventory.items = [];
    }

    // Update the amount if the item is in the inventory already.
    let currentItem;
    if ((currentItem = inventory.items.find((x: {id: any}) => x.id === item))) {
        if (currentItem.amount + amount > 0) {
            currentItem.amount = currentItem.amount + amount;
        } else {
            inventory.items = inventory.items.filter((x: {id: any}) => x.id != item);
        }
    } else {
        inventory.items.push({
            id: item,
            amount: amount,
        });
    }

    const input = {
        inventory: JSON.stringify(inventory),
        updated_at: now,
    };

    await database("inventory").where({userID}).update(input);

    return {
        inventory,
    };
}

/**
 * Get a specific item from the user's inventory.
 */
export async function getItem(userID: string, _item: string): Promise<TypeInventoryItem | null> {
    const inv: TypeInventory = await getInventory(userID);
    const invJson = JSON.parse(inv.inventory);
    const item = await invJson.items.find((item: TypeInventoryItem) => item.id === _item);

    return item;
}

/**
 * Get the inventory for the user
 */
export async function getInventory(userID: string): Promise<TypeInventory> {
    const inventory = await database("inventory").where({userID}).first();
    if (!inventory) {
        return await initiateInventory(userID);
    }
    return inventory;
}

/**
 * Add a inventory record for the user
 */
export async function initiateInventory(userID: string): Promise<TypeInventory> {
    const now = new Date();
    // eslint-disable-next-line quotes
    const json = JSON.stringify('{"items": []}');
    const input = {
        userID,
        inventory: JSON.parse(json),
        created_at: now,
        updated_at: now,
    };

    await database("inventory").insert(input);

    return input;
}
