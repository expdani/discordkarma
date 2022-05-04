import {gql} from "apollo-boost";

export const GET_RANDOM_MESSAGE_EVENT = gql`
    query GetRandomMessageEvent {
        getRandomMessageEvent {
            id
            type
            name
            text
            answer
            successText
            failText
            rewards
            timeLimit
            rarity
        }
    }
`;
