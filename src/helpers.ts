import {Interaction} from "discord.js";
import {Command} from "./types/discord";

/**
 * Get the amount of seconds between two dates
 */
export function getAmountOfSecondsBetweenDates(date1: Date, date2: Date) {
    const diff = (date1.getTime() - date2.getTime()) / 1000;
    return Math.abs(diff);
}

/**
 * Reply to command.
 */
export async function reply(command: Command, reply: any): Promise<any> {
    if (command instanceof Interaction && !command.isCommand()) return;

    const msg = await command.reply(reply);

    return msg;
}

/**
 * Check if instance of...
 */
export function isInteraction(command: Command) {
    return command instanceof Interaction;
}

/**
 * Function that shuffles the items in an array
 */
export function shuffleArray(array: Array<any>) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Function that translates seconds to a readable string
 */
export default function secondsToReadableString(unParsedSeconds: number) {
    if (unParsedSeconds < 0) {
        throw new Error("Unable to get readable string when seconds is a negative number");
    }

    let readableString = "";
    const hours = Math.floor(unParsedSeconds / 3600);
    const minutes = Math.floor((unParsedSeconds - hours * 3600) / 60);
    const seconds = Math.ceil(unParsedSeconds - hours * 3600 - minutes * 60) || 0;

    if (hours) readableString += hours > 1 ? `${hours} hours ` : `${hours} hour `;
    if (minutes) readableString += minutes > 1 ? `${minutes} minutes ` : `${minutes} minute `;
    if (seconds) readableString += seconds > 1 ? `${seconds} seconds ` : `${seconds} second `;

    return readableString;
}

/**
 * Random number between min and max.
 */
export function randomInt(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
