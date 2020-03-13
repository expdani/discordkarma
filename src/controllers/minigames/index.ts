import {Message} from "discord.js";
import {requestTriviaQuestion} from "./trivia";

/**
 * Setup commands for minigames
 */
export default function setupMinigameCommands(message: Message) {
    const messageChannel = message.channel;

    // Array with every word that the user added to the command
    // The first item in the array is the command prefix + the command itself
    // all the others words are arguments that can be passed to the command
    const wordsInCommand = message.content.split(" ");
    const command = wordsInCommand[0].substr(1, wordsInCommand[0].length + 1); // Remove the command prefix

    if (command === "trivia") {
        requestTriviaQuestion(messageChannel, message.author);
    }
}
