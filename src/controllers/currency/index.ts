import database from "../../database/index";

/**
 * Get the current balance for the user
 */
export async function getCurrency(userID: string) {
    return database("currency")
        .where({userID})
        .first();
}

/**
 * Add a currency record for the user
 */
export async function initiateCurrency(userID: string) {
    // Make sure that there is no currency record for this user yet
    const currency = await getCurrency(userID);

    if (!currency) {
        const now = new Date();
        return database("currency").insert({
            userID,
            wallet: 100,
            bank: 5000,
            created_at: now,
            updated_at: now,
        });
    }

    return currency;
}
