import {CURRENCY_SIGN} from "./../../types/currency";
import {MessageEmbed, TextChannel, User} from "discord.js";
import {getCurrency, initiateCurrency} from "./";
import {Command} from "../../types/discord";

/**
 * The bot tells the user the amount of money he has.
 */
async function sayUserBalance(channel: TextChannel, user: User) {
    try {
        const currency = await getCurrency(user.id);
        const wallet = (currency && currency.wallet) || 0;
        const bank = (currency && currency.bank) || 0;

        // Add a currency record to the database if this is the first time that the user
        // requests something currency related
        if (!currency) {
            await initiateCurrency(user.id);
        }
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s balance`, `${user.avatarURL()}`)
            .setDescription(`**Wallet:** ${CURRENCY_SIGN}${wallet}\n**Bank:** ${CURRENCY_SIGN}${bank}`)
            .setColor("#fffff");
        channel.send({embeds: [embed]});
    } catch (err) {
        channel.send("Oops, something went wrong requesting your balance.");
    }
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) sayUserBalance(messageChannel, command.member?.user as User);
}
