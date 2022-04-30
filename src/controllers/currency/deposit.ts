import {reply} from "../../helpers";
import {CURRENCY_SIGN} from "./../../types/currency";
import {Message, MessageEmbed, User} from "discord.js";
import {Command} from "../../types/discord";
import {getInteractionAttribute, getMessageAttribute} from "../../commandHandler";
import {TypeMessageResponse} from "../../types/response";
import {apolloClient} from "../../apollo";
import {DEPOSIT} from "./gql";
import getErrorMessage from "../../apollo/errors";

/**
 * Withdraw money to wallet.
 */
export async function deposit(command: Command, response: TypeMessageResponse) {
    try {
        const user = command.member?.user as User;
        let amount: number =
            command instanceof Message
                ? parseFloat(getMessageAttribute(response, 0) as string)
                : (getInteractionAttribute(response, "money") as number);

        amount = parseFloat(amount.toFixed(2));

        const {data} = await apolloClient.mutate({
            mutation: DEPOSIT,
            variables: {user_id: user.id, amount: amount},
        });

        const currency = data.deposit;

        const avatar = user.avatarURL()
            ? user.avatarURL()
            : "https://media.istockphoto.com/photos/lol-emoji-isolated-on-white-background-laughing-face-emoticon-3d-picture-id856170516";
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s financials`, `${avatar}`)
            .setDescription(
                `Deposited ${amount ? `${CURRENCY_SIGN}${amount}.` : "all your money."} \n**Wallet:** ${CURRENCY_SIGN}${
                    currency.wallet
                }\n**Bank:** ${CURRENCY_SIGN}${currency.bank}`,
            )
            .setColor("#00FF00");
        reply(command, {embeds: [embed]});
    } catch (err: any) {
        reply(command, getErrorMessage(err.graphQLErrors[0]?.message));
    }
}
