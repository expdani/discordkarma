import database from "../../database/index";
import {TypeCurrency, TypeCurrencyInput} from "../../types/currency";

/**
 * Get the current balance for the user
 */
export async function getCurrency(userID: string): Promise<TypeCurrency> {
    const currency = await database("currency").where({userID}).first();
    if (!currency) {
        return await initiateCurrency(userID);
    }
    return currency;
}

/**
 * Add a currency record for the user
 */
export async function initiateCurrency(userID: string): Promise<TypeCurrency> {
    const now = new Date();
    const input: TypeCurrencyInput = {
        userID,
        wallet: 0,
        bank: 0,
        created_at: now,
        updated_at: now,
    };

    const ids: Array<number> = await database("currency").insert(input);
    return {...input, id: ids[0]};
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
