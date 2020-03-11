/**
 * @enum with the commands for the currency module
 */
export enum CURRENCY_COMMANDS {
    bal = "bal",
    balance = "balance",
    give = "give",
}

/**
 * @type with a single currency item from the database.
 */
export type TypeCurrency = {
    id: number;
    userID: string;
    wallet: number;
    bank: number;
    updated_at: Date;
    created_at: Date;
};

/**
 * @type with the input for a new currency entry in the database
 */
export type TypeCurrencyInput = {
    userID: string;
    wallet: number;
    bank: number;
    created_at: Date;
    updated_at: Date;
};
