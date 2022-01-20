import {TextChannel} from "discord.js";
import {TypeMessageResponse} from "../../types/response";
import {Command} from "../../types/discord";
import {sayUserBalance} from "./balance";
import {withdraw} from "./withdraw";
import {deposit} from "./deposit";
/**
 * Setup the command that are related to currency in the bot
 */
export function setupBalanceCommand(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) sayUserBalance(command);
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupWithdrawCommand(command: Command, response: TypeMessageResponse) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) withdraw(command, response);
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupDepositCommand(command: Command, response: TypeMessageResponse) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) deposit(command, response);
}
