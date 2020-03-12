import {Channel} from "../../types/discord";
import {TRIVIA_API_URL, TriviaQuestion, TRIVIA_PAYOUT} from "../../types/trivia";
import secondsToReadableString, {getAmountOfSecondsBetweenDates, shuffleArray} from "../../helpers";
import fetch from "node-fetch";
import {Message, Collection, RichEmbed, User} from "discord.js";
import {decodeHTML} from "entities";
import {changeCurrency} from "../currency";

const TRIVIA_TIMEOUT = 120; // seconds

type TimeoutCache = {[userID: string]: Date};

/**
 * Object with trivia request. This object stores user ID's and the last time when they requested a trivia question
 * Users can only request a trivia question every 120 seconds
 */
const TRIVIA_REQUESTS: TimeoutCache = {};

const TIME_TO_ANSWER = 10; // seconds

/**
 * Get a single trivia question from the open trivia question database
 */
async function getQuestion() {
    const apiCall = await fetch(TRIVIA_API_URL);
    const data: {results: Array<TriviaQuestion>} = await apiCall.json();
    const {difficulty, correct_answer, incorrect_answers, question} = data.results[0];
    const payout = TRIVIA_PAYOUT[difficulty];
    // Merge the incorrect answers with the correct answer and shuffle the answers
    const answers: Array<string> = shuffleArray([...incorrect_answers, correct_answer]);

    return {
        payout,
        answers,
        correctAnswer: correct_answer,
        difficulty,
        question,
    };
}

/**
 * Handle the answer that the user gave on this question
 * Add balance to the user if the answer was correct
 */
async function handleUserAnswer(
    collectedMessages: Collection<string, Message>,
    channel: Channel,
    questionData: {
        answers: Array<string>;
        correctAnswer: string;
        payout: number;
    },
    userID: string,
) {
    try {
        const messagesArray = collectedMessages.array();
        const message = messagesArray[0].content;
        const {answers, payout, correctAnswer} = questionData;

        // The user needs to give an answer which is a single number
        const answerNumber = message.length === 1 ? Number(message) : undefined;
        const isAnswerCorrect = answerNumber && !isNaN(answerNumber) && answers[answerNumber - 1] === correctAnswer;

        if (isAnswerCorrect) {
            await changeCurrency(userID, payout);
            channel.send("You gave the correct answer! Big brain! :nerd:");
        } else {
            channel.send(
                `Whoops that's not correct :man_facepalming:. The right answer is: **${decodeHTML(correctAnswer)}**`,
            );
        }
    } catch (err) {
        channel.send("Whoops something went wrong while processing your answer");
    }
}

/**
 * Ask the user a question
 */
async function askQuestion(channel: Channel, user: User) {
    let answerList = "";
    const {answers, payout, difficulty, question, correctAnswer} = await getQuestion();

    // Compose a question with all it's answers.
    answers.forEach((answer, index) => (answerList += `\n${index + 1}) ${decodeHTML(answer)}`));
    const questionMessage = `**${question}** ${answerList}\n\n **Difficulty:** ${difficulty} \n **Payout:** $${payout}`;

    // Send the question in the chat
    const embed = new RichEmbed()
        .setAuthor(`${user.username}'s trivia question`, user.avatarURL)
        .setDescription(decodeHTML(questionMessage))
        .setColor("#fffff");
    channel.send(embed);

    // Set a listener that automatically removes itself. It listens to the first response
    // from this user that asked the question. This response is considered as the "answer"
    channel
        .awaitMessages(
            // Only listen for messages for the user that asked the trivia question
            (response: Message) => Boolean(response.author.id === user.id),
            // The user is only allowed to answer once, within "X" seconds
            {max: 1, time: TIME_TO_ANSWER * 1000, errors: ["time"]},
        )
        .then((collectedMessages: Collection<string, Message>) => {
            const questionData = {answers, correctAnswer, payout};
            handleUserAnswer(collectedMessages, channel, questionData, user.id);
        })
        .catch(() => channel.send("You did not respond to the question :confused:"));
}

/**
 * Request a trivia question. This is only possible if the user did not request one in the last 120 seconds
 */
export function requestTriviaQuestion(channel: Channel, user: User) {
    const lastRequest = TRIVIA_REQUESTS[user.id];

    if (lastRequest) {
        const secondsBetweenLastRequest = getAmountOfSecondsBetweenDates(new Date(), lastRequest);

        if (secondsBetweenLastRequest < TRIVIA_TIMEOUT) {
            const secondsWaiting = Math.round(TRIVIA_TIMEOUT - secondsBetweenLastRequest);
            channel.send(`You have to wait ${secondsToReadableString(secondsWaiting)}before you can use trivia again`);
            return;
        }
    }

    TRIVIA_REQUESTS[user.id] = new Date();
    askQuestion(channel, user);
}
