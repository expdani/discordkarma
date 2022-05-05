import {gql} from "@apollo/client/core";

export const GET_INVENTORY = gql`
    query GetInventory($user_id: String!) {
        getInventory(user_id: $user_id) {
            user_id
            inventory
            created_at
            updated_at
        }
    }
`;

export const GET_ITEMS = gql`
    query GetItems($items: [String]!) {
        getItems(items: $items) {
            id
            name
            description
            emoji
            price
            shop
        }
    }
`;

export const ADD_ITEM_TO_INVENTORY = gql`
    mutation AddItemToInventory($user_id: String!, $item: String!, $amount: Int) {
        addItemToInventory(user_id: $user_id, item: $item, amount: $amount) {
            user_id
            inventory
            created_at
            updated_at
        }
    }
`;
