import {Message} from "discord.js";
import {TypeDialogflowEvent} from "../../types/dialogflow";
import dialogflow from "dialogflow";
import {v4} from "uuid";
import {EventEmitter} from "events";

const eventEmitter = new EventEmitter();

// TODO: remove type package when dialogflow v2 releases
const sessionId = v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath("discordbot-hnifri", sessionId);

/**
 * add a callback
 */
export const addEvent = (callback: (e: TypeDialogflowEvent) => void) => {
    eventEmitter.addListener("onDialogflow", callback);
};

/**
 * Remove a callback
 */
export const removeEvent = (callback: (e: TypeDialogflowEvent) => void) => {
    eventEmitter.removeListener("onDialogflow", callback);
};

/**
 * Clear all callbacks
 */
export const clearEvents = () => {
    eventEmitter.removeAllListeners("onDialogflow");
};

/**
 * Use dialogflow to calculate a response
 */
export const useDialogflow = (data: {text: string; message: Message}) => {
    const {text, message} = data;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: "en-US",
            },
        },
    };

    sessionClient
        .detectIntent(request)
        .then((data) => {
            const {queryResult} = data[0];

            // TODO: add a type? It's possible to get the name of the intent
            eventEmitter.emit("onDialogflow", {
                text: queryResult.queryText,
                parameters: queryResult.parameters,
                response: queryResult.fulfillmentText,
                message: message,
            });
        })
        .catch((err) => {
            // TODO: do something useful
            console.log("Whooops");
        });
};
