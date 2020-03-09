// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");
import dialogflow from "dialogflow";
import {v4} from "uuid";

// import dotenv before it is loaded into enviroment variables
const result = dotenv.config();

// TODO: remove type package when dialogflow v2 releases
// default for projectID should never be used
const projectID = result.parsed.DIALOGFLOW_PROJECT_ID || "none";

const sessionId = v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectID, sessionId);

/**
 * Use dialogflow to calculate a response
 */
export const useDialogflow = async (text: string) => {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
    }

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
