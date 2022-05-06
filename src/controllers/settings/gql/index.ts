import {gql} from "@apollo/client/core";

export const GET_SERVER_SETTINGS = gql`
    query GetServerSettings($server_id: String!) {
        getServerSettings(server_id: $server_id) {
            karma_enabled
            karma_reactions
            random_message_events_enabled
            created_at
            updated_at
        }
    }
`;

export const GET_BOT_SETTINGS = gql`
    query GetBotSettings {
        getBotSettings {
            settings
            created_at
            updated_at
        }
    }
`;
