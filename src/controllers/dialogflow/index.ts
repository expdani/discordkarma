import dialogflow from "dialogflow";
import {v4} from "uuid";

// TODO: add installation to gettings started
// TODO: remove type package when dialogflow v2 releases
const sessionId = v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(process.env.DIALOGFLOW_PROJECT_ID, sessionId);

/**
 * Use dialogflow to calculate a response
 */
export const useDialogflow = async (text: string) => {
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: "en-US",
            },
        },
    };

    return await sessionClient.detectIntent(request);
};
