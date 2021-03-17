import {Message, MessageEmbed, User} from "discord.js";
import {getCurrency, initiateCurrency} from "./";
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
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s balance`, `${user.avatarURL()}`)
            .setDescription(`**Wallet:** $${wallet}\n**Bank:** $${bank}`)
            .setColor("#fffff");
        channel.send(embed);
    } catch (err) {
        channel.send("Oops, something went wrong requesting your balance.");
    }
}

/**
 * Setup the command that are related to currency in the bot
 */
export function setupCurrencyCommands(message: Message) {
    const messageChannel = message.channel;

    if (messageChannel.type == "text" || messageChannel.type == "news") {
        sayUserBalance(messageChannel, message.author);
    }
}
