import {reply} from "../../helpers";
import {CURRENCY_SIGN} from "./../../types/currency";
import {Message, MessageEmbed, User} from "discord.js";
import {changeCurrency, getCurrency} from "./";
import {Command} from "../../types/discord";
import {getInteractionAttribute, getMessageAttribute} from "../../commandHandler";
import {TypeMessageResponse} from "../../types/response";

/**
 * Withdraw money to wallet.
 */
export async function withdraw(command: Command, response: TypeMessageResponse) {
    try {
        const user = command.member?.user as User;
        const currency = await getCurrency(user.id);
        let amount =
            command instanceof Message
                ? parseFloat(getMessageAttribute(response, 0) as string)
                : (getInteractionAttribute(response, "money") as number);
        if (!amount || amount <= 0) amount = currency.bank;

        if (currency.bank >= amount) {
            const newCurrency = await changeCurrency(user.id, amount, -amount);

            const avatar = user.avatarURL()
                ? user.avatarURL()
                : "https://media.istockphoto.com/photos/lol-emoji-isolated-on-white-background-laughing-face-emoticon-3d-picture-id856170516";
            const embed = new MessageEmbed()
                .setAuthor(`${user.username}'s financials`, `${avatar}`)
                .setDescription(
                    `Withdrew ${CURRENCY_SIGN}${amount}\n**Wallet:** ${CURRENCY_SIGN}${newCurrency.wallet}\n**Bank:** ${CURRENCY_SIGN}${newCurrency.bank}`,
                )
                .setColor("#FF0000");
            reply(command, {embeds: [embed]});
        } else reply(command, `You don't have ${CURRENCY_SIGN}${amount} to withdraw.`);
    } catch (err) {
        reply(command, "Oops, something went wrong depositing your money.");
    }
}
