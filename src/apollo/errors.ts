import {errors} from "../../assets/errors.json";

type ErrorType = {
    key: string;
    message: string;
};

/**
 * Fetch error message.
 */
export default function getErrorMessage(key: string): string {
    const errorMessage = errors.find((error: ErrorType) => error.key === key)?.message;
    return errorMessage || "Oops, something went wrong. Please try again.";
}
