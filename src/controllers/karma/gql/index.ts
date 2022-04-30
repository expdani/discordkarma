import {gql} from "@apollo/client/core";

export const GET_SERVER_KARMA_LEADERBOARD = gql`
    query GetServerLeaderboard($server_id: String!) {
        getServerLeaderboard(server_id: $server_id) {
            user_id
            server_id
            total
            created_at
            updated_at
        }
    }
`;

export const GET_USER_KARMA = gql`
    query GetUserKarma($user_id: String!, $server_id: String!) {
        getUserKarma(user_id: $user_id, server_id: $server_id) {
            user_id
            server_id
            total
            created_at
            updated_at
        }
    }
`;

export const CREATE_KARMA_POST = gql`
    mutation CreateKarmaPost(
        $user_id: String!
        $server_id: String!
        $message_id: String!
        $author_id: String!
        $vote: VoteEnum!
    ) {
        createKarmaPost(
            user_id: $user_id
            server_id: $server_id
            message_id: $message_id
            author_id: $author_id
            vote: $vote
        ) {
            user_id
            message_id
            author_id
            server_id
            vote
            created_at
            updated_at
        }
    }
`;

export const DELETE_KARMA_POST = gql`
    mutation DeleteKarmaPost($user_id: String!, $server_id: String!, $message_id: String!, $author_id: String!) {
        deleteKarmaPost(user_id: $user_id, server_id: $server_id, message_id: $message_id, author_id: $author_id) {
            user_id
            server_id
            message_id
            author_id
            vote
            created_at
            updated_at
        }
    }
`;

export const ADD_KARMA = gql`
    mutation AddKarma($user_id: String!, $server_id: String!, $amount: Int!) {
        addKarma(user_id: $user_id, server_id: $server_id, amount: $amount) {
            user_id
            server_id
            total
            created_at
            updated_at
        }
    }
`;
