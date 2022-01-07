import {CURRENCY_SIGN} from "./../../../types/currency";
import {Command} from "../../../types/discord";
import {TRIVIA_API_URL, TriviaQuestion, TRIVIA_PAYOUT} from "../../../types/trivia";
import secondsToReadableString, {getAmountOfSecondsBetweenDates, reply, shuffleArray} from "../../../helpers";
import fetch from "node-fetch";
import {MessageEmbed, User, MessageActionRow, MessageButton, Interaction, Message} from "discord.js";
import {decodeHTML} from "entities";
import {changeCurrency} from "../../currency";
import {correctMsgs, wrongMsgs} from "../../../../assets/random.json";

const TRIVIA_TIMEOUT = 15; // seconds

type TimeoutCache = {[userID: string]: Date};
type MessageCache = {[commandId: string]: Message};

/**
 * Object with trivia request. This object stores user ID's and the last time when they requested a trivia question
 * Users can only request a trivia question every .. seconds
 */
const TRIVIA_REQUESTS: TimeoutCache = {};
const TRIVIA_MESSAGES: MessageCache = {};

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
    i: Interaction,
    questionData: {
        answers: Array<string>;
        correctAnswer: string;
        payout: number;
        questionMessage: string;
    },
    userID: string,
    answersRow: MessageActionRow,
    collector: any,
) {
    try {
        if (!i.isButton()) return;
        const {answers, payout, correctAnswer, questionMessage} = questionData;

        // The user needs to give an answer which is a single number
        const answerNumber = parseInt(i.customId);

        const isAnswerCorrect = answerNumber && !isNaN(answerNumber) && answers[answerNumber - 1] === correctAnswer;

        if (isAnswerCorrect) {
            const randomMsg = correctMsgs[Math.floor(Math.random() * correctMsgs.length)];
            await changeCurrency(userID, payout);
            const embed = new MessageEmbed()
                .setDescription(`${decodeHTML(questionMessage)}\n\n**${randomMsg}**`)
                .setColor("#00FF00");
            await i.deferUpdate();
            await i.editReply({embeds: [embed], components: [answersRow]});
            collector.stop("answered");
        } else {
            const randomMsg = wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)];
            const embed = new MessageEmbed()
                .setDescription(
                    `~~${decodeHTML(questionMessage)}~~\n\n**${randomMsg}\nHet antwoord was ${decodeHTML(
                        correctAnswer,
                    )}**.`,
                )
                .setColor("#FF0000");
            await i.deferUpdate();
            await i.editReply({embeds: [embed], components: [answersRow]});
            collector.stop("answered");
        }
    } catch (err) {
        i.channel?.send("Oops, something went wrong processing your answer.");
    }
}

/**
 * Ask the user a question
 */
async function askQuestion(command: Command, user: User) {
    let answerList = "";
    const {answers, payout, difficulty, question, correctAnswer} = await getQuestion();

    const row = new MessageActionRow();
    const answersRow = new MessageActionRow();

    // Compose a question with all it's answers.
    answers.forEach((answer, index) => {
        answerList += `\n${index + 1}) ${decodeHTML(answer)}`;
        row.addComponents(
            new MessageButton()
                .setCustomId(`${index + 1}`)
                .setLabel(`${index + 1}) ${decodeHTML(answer)}`)
                .setStyle("PRIMARY"),
        );

        const isAnswerCorrect = answers[index] === correctAnswer;

        answersRow.addComponents(
            new MessageButton()
                .setCustomId(`${index + 1}`)
                .setLabel(`${index + 1}) ${decodeHTML(answer)}`)
                .setStyle(isAnswerCorrect ? "SUCCESS" : "DANGER")
                .setDisabled(true),
        );
    });

    const questionMessage = `**${question}** ${answerList}\n\n **Difficulty:** ${difficulty}
                                **Payout:** ${CURRENCY_SIGN}${payout}`;

    // Send the question in the chat
    const embed = new MessageEmbed()
        .setAuthor(`${user.username}'s trivia question`, `${user.avatarURL()}`)
        .setDescription(decodeHTML(questionMessage))
        .setColor("#fffff");

    if (command instanceof Message) {
        command.reply({embeds: [embed], components: [row]}).then((sent) => {
            const msg = command.channel?.messages.cache.get(sent.id);

            if (sent.id && msg) TRIVIA_MESSAGES[command.id] = msg;
        });
    } else reply(command, {embeds: [embed], components: [row]});

    const filter = (i: any) => i.user.id === user.id;

    const collector = command.channel?.createMessageComponentCollector({filter, time: TIME_TO_ANSWER * 1000});

    const questionData = {questionMessage, answers, correctAnswer, payout};

    collector?.on("collect", async (i) => {
        handleUserAnswer(i, questionData, user.id, answersRow, collector);
    });

    collector?.on("end", (_collected, reason) => {
        if (reason != "answered") handleTimeout(command, questionData, answersRow);
    });
}

/**
 * Request a trivia question. This is only possible if the user did not request one in the last 120 seconds
 */
export function requestTriviaQuestion(command: Command, user: User) {
    const lastRequest = TRIVIA_REQUESTS[user.id];

    if (lastRequest) {
        const secondsBetweenLastRequest = getAmountOfSecondsBetweenDates(new Date(), lastRequest);

        if (secondsBetweenLastRequest < TRIVIA_TIMEOUT) {
            const secondsWaiting = Math.round(TRIVIA_TIMEOUT - secondsBetweenLastRequest);
            reply(
                command,
                `You have to wait ${secondsToReadableString(secondsWaiting)}before you can use trivia again.`,
            );
            return;
        }
    }

    TRIVIA_REQUESTS[user.id] = new Date();
    askQuestion(command, user);
}

/**
 * Handle timeout if the user doesn't answer in time
 */
async function handleTimeout(
    command: Command,
    questionData: {
        questionMessage: string;
    },
    answersRow: MessageActionRow,
) {
    try {
        const {questionMessage} = questionData;
        const randomMsg = wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)];
        const embed = new MessageEmbed()
            .setDescription(`~~${decodeHTML(questionMessage)}~~\n\n**${randomMsg}\nJe moet wel antwoorden, dombo**.`)
            .setColor("#FF0000");
        if (command instanceof Interaction) {
            if (command.isCommand()) {
                command.fetchReply();
                command.editReply({embeds: [embed], components: [answersRow]});
            }
        } else {
            const msg = TRIVIA_MESSAGES[command.id];
            if (msg.editable) msg.edit({embeds: [embed], components: [answersRow]});
        }
    } catch (err) {
        command.channel?.send("Oops, something went wrong processing your answer.");
    }
}
