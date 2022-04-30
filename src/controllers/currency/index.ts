import {apolloClient} from "../../apollo";
import {TypeCurrency} from "../../types/currency";
import {ADD_CURRENCY, GET_CURRENCY} from "./gql";

export const CURRENCY_TYPE = {
    WALLET: "WALLET",
    BANK: "BANK",
};

/**
 * Get the current balance for the user
 */
export async function getCurrency(user_id: string): Promise<TypeCurrency> {
    const {data} = await apolloClient.query({
        query: GET_CURRENCY,
        variables: {user_id},
    });

    return data.getCurrency;
}

/**
 * Edit the currency of the user.
 */
export async function changeCurrency(user_id: string, type: string, amount: number): Promise<TypeCurrency> {
    const fixedAmount = parseFloat(amount?.toFixed(2));

    const {data} = await apolloClient.mutate({
        mutation: ADD_CURRENCY,
        variables: {user_id, type, amount: fixedAmount},
    });

    return data.changeCurrency;
}
