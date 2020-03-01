import {Message} from "discord.js";
import {TypeDialogflowEvent} from "../../types/dialogflow";
import dialogflow from "dialogflow";
import {v4} from "uuid";
import {EventEmitter} from "events";

// TODO: remove type package when dialogflow v2 releases
/**
 * Handles allgflow related functionalities
 */
class Dialogflow {
    eventEmitter = new EventEmitter();

    sessionId = v4();
    sessionClient = new dialogflow.SessionsClient();
    sessionPath = this.sessionClient.sessionPath("discordbot-hnifri", this.sessionId);

    /**
     * add a callback
     */
    addEvent = (callback: (e: TypeDialogflowEvent) => void) => {
        this.eventEmitter.addListener("onDialogflow", callback);
    };

    /**
     * Remove a callback
     */
    removeEvent = (callback: (e: TypeDialogflowEvent) => void) => {
        this.eventEmitter.removeListener("onDialogflow", callback);
    };

    /**
     * Clear all callbacks
     */
    clearEvents = () => {
        this.eventEmitter.removeAllListeners("onDialogflow");
    };

    /**
     * Use dialogflow to calculate a response
     */
    useDialogflow = (data: {text: string; message: Message}) => {
        const {text, message} = data;

        const request = {
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: "en-US",
                },
            },
        };

        this.sessionClient
            .detectIntent(request)
            .then((data) => {
                const {queryResult} = data[0];

                // TODO: add a type? It's possible to get the name of the intent
                this.eventEmitter.emit("onDialogflow", {
                    text: queryResult.queryText,
                    parameters: queryResult.parameters,
                    response: queryResult.fulfillmentText,
                    message: message,
                });
            })
            .catch(() => {
                console.log("Whoops");
            });
    };
}

export default Dialogflow;
