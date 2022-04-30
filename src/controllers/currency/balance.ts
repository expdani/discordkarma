import {reply} from "../../helpers";
import {CURRENCY_SIGN} from "./../../types/currency";
import {MessageEmbed, User} from "discord.js";
import {getCurrency} from "./";
import {Command} from "../../types/discord";

/**
 * The bot tells the user the amount of money he has.
 */
export async function sayUserBalance(command: Command) {
    try {
        const user = command.member?.user as User;
        if (!user) return;
        const currency = await getCurrency(user.id);

        const avatar = user.avatarURL()
            ? user.avatarURL()
            : "https://media.istockphoto.com/photos/lol-emoji-isolated-on-white-background-laughing-face-emoticon-3d-picture-id856170516";
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s financials`, `${avatar}`)
            .setDescription(
                `**Wallet:** ${CURRENCY_SIGN}${currency.wallet}\n**Bank:** ${CURRENCY_SIGN}${currency.bank}`,
            )
            .setColor("#fffff");
        reply(command, {embeds: [embed]});
    } catch (err) {
        reply(command, "Oops, something went wrong requesting your balance.");
    }
}
