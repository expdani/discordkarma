import database from "../../database/index";
import {TypeCurrency, TypeCurrencyInput} from "../../types/currency";

/**
 * Get the current balance for the user
 */
export async function getCurrency(userID: string): Promise<TypeCurrency | void> {
    return database("currency").where({userID}).first();
}

/**
 * Add a currency record for the user
 */
export async function initiateCurrency(userID: string): Promise<TypeCurrency> {
    // Make sure that there is no currency record for this user yet
    const currency = await getCurrency(userID);

    if (!currency) {
        const now = new Date();
        const input: TypeCurrencyInput = {
            userID,
            wallet: 0,
            bank: 0,
            created_at: now,
            updated_at: now,
        };

        // Insert returns an array with the id's of the inserted items
        const ids: Array<number> = await database("currency").insert(input);
        return {...input, id: ids[0]};
    }

    return currency;
}

/**
 * Edit the currency of the user.
 * - A positive number adds money to the user
 * - A negative number removed money from the user
 */
export async function changeCurrency(userID: string, addedValueToWallet = 0, addedValueTobank = 0) {
    let currency = await getCurrency(userID);
    if (!currency) {
        currency = await initiateCurrency(userID);
    }

    const newCurrency = {
        ...currency,
        wallet: currency.wallet + addedValueToWallet,
        bank: currency.bank + addedValueTobank,
    };

    await database("currency").where({userID}).update(newCurrency);

    return newCurrency;
}
