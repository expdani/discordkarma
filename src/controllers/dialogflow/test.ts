import {TypeDialogflowEvent} from "../../types/dialogflow";

/**
 * Handle dialog response
 */
export function testDialog(e: TypeDialogflowEvent) {
    const {message, response} = e;
    message.channel.send(response);
}
