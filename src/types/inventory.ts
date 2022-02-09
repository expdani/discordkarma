/**
 * @type with a user inventory from the database.
 */
export type TypeInventory = {
    userID: string;
    inventory: TypeInventoryItem | any;
    updated_at: Date;
    created_at: Date;
};

/**
 * @type with a single inventory item from the database.
 */
export type TypeInventoryItems = {
    items: TypeInventoryItem;
};

/**
 * @type with a single inventory item from the database.
 */
export type TypeInventoryItem = {
    id: string;
    amount: number;
};
