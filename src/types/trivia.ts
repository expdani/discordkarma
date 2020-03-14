/**
 * Constant with the API url for the trivia questions
 */
export const TRIVIA_API_URL = "https://opentdb.com/api.php?amount=1&type=multiple";

/**
 * @type with a single trivia question
 */
export type TriviaQuestion = {
    category: string;
    type: "multiple";
    difficulty: TRIVIA_DIFFICULTIES;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
};

/**
 * @enum with the difficulty of the trivia questions
 */
export enum TRIVIA_DIFFICULTIES {
    easy = "easy",
    medium = "medium",
    hard = "hard",
}

/**
 * @enum with the currency payour for every trivia question
 */
export enum TRIVIA_PAYOUT {
    easy = 10,
    medium = 25,
    hard = 50,
}
