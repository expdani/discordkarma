import {CURRENCY_SIGN} from "./../../../types/currency";
import {Channel} from "../../../types/discord";
import {TRIVIA_API_URL, TriviaQuestion, TRIVIA_PAYOUT} from "../../../types/trivia";
import secondsToReadableString, {getAmountOfSecondsBetweenDates, shuffleArray} from "../../../helpers";
import fetch from "node-fetch";
import {Message, Collection, MessageEmbed, User} from "discord.js";
import {decodeHTML} from "entities";
import {changeCurrency} from "../../currency";
import {correctMsgs, wrongMsgs} from "../../../../assets/random.json";

const TRIVIA_TIMEOUT = 60; // seconds

type TimeoutCache = {[userID: string]: Date};

/**
 * Object with trivia request. This object stores user ID's and the last time when they requested a trivia question
 * Users can only request a trivia question every .. seconds
 */
const TRIVIA_REQUESTS: TimeoutCache = {};

const TIME_TO_ANSWER = 10; // seconds

/**
 * Get a single trivia question from the open trivia question database
 */
async function getQuestion() {
    const apiCall = await fetch(TRIVIA_API_URL);
    const data: {results: Array<TriviaQuestion>} = await apiCall.json();
    const {difficulty, correct_answer: correctAnswer, incorrect_answers: incorrectAnswers, question} = data.results[0];
    const payout = TRIVIA_PAYOUT[difficulty];
    // Merge the incorrect answers with the correct answer and shuffle the answers
    const answers: Array<string> = shuffleArray([...incorrectAnswers, correctAnswer]);

    return {
        payout,
        answers,
        correctAnswer,
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
        const message = collectedMessages.first();
        console.log(message);

        const {answers, payout, correctAnswer} = questionData;

        // The user needs to give an answer which is a single number
        const answerNumber = message?.content.length === 1 ? Number(message) : undefined;
        const isAnswerCorrect = answerNumber && !isNaN(answerNumber) && answers[answerNumber - 1] === correctAnswer;

        if (isAnswerCorrect) {
            const randomMsg = correctMsgs[Math.floor(Math.random() * correctMsgs.length)];
            await changeCurrency(userID, payout);
            const embed = new MessageEmbed().setDescription(`**${randomMsg}**`).setColor("#00FF00");
            channel.send({embeds: [embed]});
        } else {
            const randomMsg = wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)];
            const embed = new MessageEmbed()
                .setDescription(`**${randomMsg} Het antwoord was ${decodeHTML(correctAnswer)}**.`)
                .setColor("#FF0000");
            channel.send({embeds: [embed]});
        }
    } catch (err) {
        channel.send("Whoops, something went wrong processing your answer.");
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
    const questionMessage = `**${question}** ${answerList}\n\n **Difficulty:** ${difficulty}
                                **Payout:** ${CURRENCY_SIGN}${payout}`;

    // Send the question in the chat
    const embed = new MessageEmbed()
        .setAuthor(`${user.username}'s trivia question`, `${user.avatarURL()}`)
        .setDescription(decodeHTML(questionMessage))
        .setColor("#fffff");
    channel.send({embeds: [embed]});

    // Await answer
    const filter = (response: Message) => Boolean(response.author.id === user.id);
    // Errors: ['time'] treats ending because of the time limit as an error
    channel
        .awaitMessages({filter, max: 1, time: TIME_TO_ANSWER * 1000, errors: ["time"]})
        .then((collectedMessages: Collection<string, Message>) => {
            const questionData = {answers, correctAnswer, payout};
            handleUserAnswer(collectedMessages, channel, questionData, user.id);
        })
        .catch(() => channel.send("You did not respond to the question :confused:."));
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
            channel.send(`You have to wait ${secondsToReadableString(secondsWaiting)}before you can use trivia again.`);
            return;
        }
    }

    TRIVIA_REQUESTS[user.id] = new Date();
    askQuestion(channel, user);
}
