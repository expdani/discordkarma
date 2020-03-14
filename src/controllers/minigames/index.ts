import {Message} from "discord.js";
import {requestTriviaQuestion} from "./trivia";

/**
 * Setup commands for minigames
 */
export default function setupMinigameCommands(message: Message) {
    const messageChannel = message.channel;

    requestTriviaQuestion(messageChannel, message.author);
}
