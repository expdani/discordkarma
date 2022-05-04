/**
 * Constant with the currency settings.
 */
export const CURRENCY = "Euro";
export const CURRENCY_SHORT = "EUR";
export const CURRENCY_SIGN = "€";

/**
 * @type with a single currency item from the database.
 */
export type TypeCurrency = {
    user_id: string;
    wallet: number;
    bank: number;
    updated_at: Date;
    created_at: Date;
};

/**
 * @type with the input for a new currency entry in the database
 */
export type TypeCurrencyInput = {
    user_id: string;
    wallet: number;
    bank: number;
    created_at: Date;
    updated_at: Date;
};
