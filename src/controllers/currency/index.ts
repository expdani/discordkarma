import {Channel} from "../../types/discord";

/**
 * Get the current balance for the user
 */
export function getUserBalance(channel: Channel) {
    // TODO: Database connection
    const userBalance = 100;

    channel.send(`You have $${userBalance}. Great job!`);
}
