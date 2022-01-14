import {reply} from "../../helpers";
import {CURRENCY_SIGN} from "./../../types/currency";
import {MessageEmbed, TextChannel, User} from "discord.js";
import {getCurrency, initiateCurrency} from "./";
import {Command} from "../../types/discord";

/**
 * The bot tells the user the amount of money he has.
 */
async function sayUserBalance(command: Command) {
    try {
        const user = command.member?.user as User;
        if (!user) return;
        const currency = await getCurrency(user.id);
        const wallet = (currency && currency.wallet) || 0;
        const bank = (currency && currency.bank) || 0;

        // Add a currency record to the database if this is the first time that the user
        // requests something currency related
        if (!currency) {
            await initiateCurrency(user.id);
        }

        const avatar = user.avatarURL()
            ? user.avatarURL()
            : "https://media.istockphoto.com/photos/lol-emoji-isolated-on-white-background-laughing-face-emoticon-3d-picture-id856170516";
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s balance`, `${avatar}`)
            .setDescription(`**Wallet:** ${CURRENCY_SIGN}${wallet}\n**Bank:** ${CURRENCY_SIGN}${bank}`)
            .setColor("#fffff");
        reply(command, {embeds: [embed]});
    } catch (err) {
        reply(command, "Oops, something went wrong requesting your balance.");
    }
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) sayUserBalance(command);
}
