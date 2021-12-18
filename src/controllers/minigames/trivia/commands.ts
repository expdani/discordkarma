import {TextChannel, User} from "discord.js";
import {requestTriviaQuestion} from "./trivia";
import {Command} from "../../../types/discord";
/**
 * Setup commands for minigames
 */
export default function setupMinigameCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        requestTriviaQuestion(messageChannel, command.member?.user as User);
    }
}
