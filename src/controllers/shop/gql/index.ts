import {gql} from "apollo-boost";

export const GET_ITEM_SHOP = gql`
    query GetItemShop {
        getItemShop {
            id
            name
            description
            emoji
            shop
            price
        }
    }
`;

export const ADD_CURRENCY = gql`
    mutation Deposit($user_id: String!, $type: CurrencyEnum!, $amount: Int!) {
        addCurrency(user_id: $user_id, type: $type, amount: $amount) {
            user_id
            bank
            wallet
            created_at
            updated_at
        }
    }
`;

export const BUY_ITEM = gql`
    mutation BuyItem($user_id: String!, $item: String!, $amount: Int) {
        buyItem(user_id: $user_id, item: $item, amount: $amount) {
            id
            name
            description
            emoji
            price
            shop
        }
    }
`;

export const SELL_ITEM = gql`
    mutation SellItem($user_id: String!, $item: String!, $amount: Int) {
        sellItem(user_id: $user_id, item: $item, amount: $amount) {
            id
            name
            description
            emoji
            price
            shop
        }
    }
`;
