import {Collection, Message} from "discord.js";
import {changeCurrency} from "../../currency";
import {addItemToInventory} from "../../inventory";
import {randomEvents} from "../../../../assets/randomEvents.json";

/**
 * Calculate a random event and handle it.
 */
export default function calculateRandomEvent(message: Message) {
    if (message.author.bot) return;

    const messageChannel = message.channel;
    const n = Math.random() * 100;

    let triggered = false;
    randomEvents.forEach((e: any) => {
        if (triggered) return;
        if (n <= e.chance) {
            messageChannel.send(e.text);

            messageChannel
                .awaitMessages(
                    // Only listen for messages for the user that asked the trivia question
                    (response: Message) =>
                        Boolean(
                            response.content.toLowerCase().includes(e.response.toLowerCase()) && !response.author.bot,
                        ),
                    // The user is only allowed to answer once, within "X" seconds
                    {max: 1, time: e.timeLimit * 1000, errors: ["time"]},
                )
                .then((collectedMessages: Collection<string, Message>) => {
                    handleUserResponse(collectedMessages, e);
                })
                .catch(() => messageChannel.send(e.failText));

            triggered = true;
        }
    });
}

/**
 * Handle user response from event.
 */
async function handleUserResponse(collectedMessages: Collection<string, Message>, event: any) {
    const messagesArray = collectedMessages.array();
    const message = messagesArray[0];
    try {
        if (event.rewards.length > 0) {
            event.rewards.forEach((reward: any) => {
                if (reward.item) {
                    addItemToInventory(message.author.id, reward.item, 1);
                }
                if (reward.wallet) {
                    changeCurrency(message.author.id, reward.wallet);
                }
            });

            message.channel.send(event.rewardText.replace("{{username}}", message.author.username));
        }
    } catch (err) {
        message.channel.send(event.failText.replace("{{username}}", message.author.username));
    }
}
