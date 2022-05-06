import {apolloClient} from "../../apollo/index";
import {TypeBotSettings} from "../../types/globalSettings";
import {TypeServerSettings} from "../../types/settings";
import {GET_BOT_SETTINGS, GET_SERVER_SETTINGS} from "./gql";

/**
 * Get server settings.
 */
export async function getServerSettings(server_id: string): Promise<TypeServerSettings> {
    const {data} = await apolloClient.query({
        query: GET_SERVER_SETTINGS,
        variables: {server_id},
    });

    return data.getServerSettings;
}

/**
 * Get global settings.
 */
export async function getGlobalSettings(): Promise<TypeBotSettings> {
    const {data} = await apolloClient.query({
        query: GET_BOT_SETTINGS,
    });

    return data.getBotSettings.settings;
}
