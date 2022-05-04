import {gql} from "@apollo/client/core";

export const GET_CURRENCY = gql`
    query GetCurrency($user_id: String!) {
        getCurrency(user_id: $user_id) {
            user_id
            bank
            wallet
            created_at
            updated_at
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

export const DEPOSIT = gql`
    mutation Deposit($user_id: String!, $amount: Int) {
        deposit(user_id: $user_id, amount: $amount) {
            user_id
            bank
            wallet
            created_at
            updated_at
        }
    }
`;

export const WITHDRAW = gql`
    mutation Withdraw($user_id: String!, $amount: Int) {
        withdraw(user_id: $user_id, amount: $amount) {
            user_id
            bank
            wallet
            created_at
            updated_at
        }
    }
`;
