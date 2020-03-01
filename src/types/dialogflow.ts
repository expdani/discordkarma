import {Message} from "discord.js";

// TODO: type parameters
export type TypeDialogflowEvent = {
    text: string;
    parameters: Record<string, string>;
    response: string;
    message: Message;
};

export type TypeDialogflow = {
    addEvent: (callback: (e: TypeDialogflowEvent) => void) => void;
    removeEvent: (callback: (e: TypeDialogflowEvent) => void) => void;
    clearEvents: () => void;
    useDialogflow: (text: string) => void;
};
