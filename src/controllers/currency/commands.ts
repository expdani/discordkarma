import {Message, RichEmbed, User} from "discord.js";
import {getCurrency, initiateCurrency} from "./";
import {CURRENCY_COMMANDS} from "../../types/currency";
import {Channel} from "../../types/discord";

/**
 * The bot tells the user the amount of money he has.
 */
async function sayUserBalance(channel: Channel, user: User) {
    try {
        const currency = await getCurrency(user.id);
        const wallet = (currency && currency.wallet) || 0;
        const bank = (currency && currency.bank) || 0;

        // Add a currency record to the database if this is the first time that the user
        // requests something currency related
        if (!currency) {
            await initiateCurrency(user.id);
        }
        const embed = new RichEmbed()
            .setAuthor(`${user.username}'s balance`, `${user.avatarURL}`)
            .setDescription(`**Wallet:** $${wallet}\n**Bank:** $${bank}`)
            .setColor("#fffff");
        channel.send(embed);
    } catch (err) {
        channel.send("Oops, something went wrong while requesting your balance.");
    }
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(message: Message) {
    const messageChannel = message.channel;

    // Array with every word that the user added to the command
    // The first item in the array is the command prefix + the command itself
    // all the others words are arguments that can be passed to the command
    const wordsInCommand = message.content.split(" ");
    const command = wordsInCommand[0].substr(1, wordsInCommand[0].length + 1); // Remove the command prefix
    // const commandArgs = wordsInCommand.length > 1 ? wordsInCommand.slice(1, wordsInCommand.length + 1) : undefined;

    if (command === CURRENCY_COMMANDS.bal || command === CURRENCY_COMMANDS.balance) {
        sayUserBalance(messageChannel, message.author);
    }
}
