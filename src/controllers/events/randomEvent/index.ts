import {Collection, Guild, Message} from "discord.js";
import {changeCurrency} from "../../currency";
import {addItemToInventory} from "../../inventory";
import {randomEvents} from "../../../../assets/randomEvents.json";
import {getAmountOfSecondsBetweenDates} from "../../../helpers";

const PERCENT_CHANCE_PER_MESSAGE = 0.33;

const EVENT_TIMEOUT = 90; // seconds

type TimeoutCache = {[serverID: string]: Date};

/**
 * Object with triggered events. This object stores server ID's and the last time when an event was triggered
 * Server events can only trigger once every EVENT_TIMEOUT seconds
 */
const SERVER_TIMEOUTS: TimeoutCache = {};

/**
 * Calculate a random event and handle it.
 */
export default function calculateRandomEvent(message: Message) {
    if (message.author.bot) return;

    const n = Math.random() * 100;

    if (n <= PERCENT_CHANCE_PER_MESSAGE) {
        let guild: Guild | null = null;
        if (message.guild) guild = message.guild;
        else return;

        const lastRequest = SERVER_TIMEOUTS[guild.id];
        if (lastRequest) {
            if (getAmountOfSecondsBetweenDates(new Date(), lastRequest) < EVENT_TIMEOUT) return;
        }

        const messageChannel = message.channel;
        const rarity = 2;

        const filteredEvents = randomEvents.filter(function (event: {rarity: number}) {
            return event.rarity === rarity;
        });

        const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];

        messageChannel.send(randomEvent.text);
        messageChannel
            .awaitMessages(
                // Only listen for messages that include the required response.
                (response: Message) =>
                    Boolean(
                        response.content.toLowerCase().includes(randomEvent.response.toLowerCase()) &&
                            !response.author.bot,
                    ),
                // The user is only allowed to answer once, within e.timeLimit seconds
                {max: 1, time: randomEvent.timeLimit * 1000, errors: ["time"]},
            )
            .then((collectedMessages: Collection<string, Message>) => {
                handleUserResponse(collectedMessages, randomEvent);
            })
            .catch(() => messageChannel.send(randomEvent.failText));

        if (guild) SERVER_TIMEOUTS[guild.id] = new Date();
    }
}

/**
 * Handle user response from event.
 */
async function handleUserResponse(collectedMessages: Collection<string, Message>, event: any) {
    const messagesArray = collectedMessages.array();
    const message = messagesArray[0];
    const username = (await message.guild?.members.fetch(message.author.id))?.nickname || message.author.username;
    try {
        if (event.rewards.length > 0) {
            event.rewards.forEach(async (reward: any) => {
                if (reward.item) {
                    await addItemToInventory(message.author.id, reward.item, 1);
                }
                if (reward.wallet) {
                    await changeCurrency(message.author.id, reward.wallet);
                }
            });

            await message.channel.send(event.rewardText.replace("{{username}}", username));
        }
    } catch (err) {
        message.channel.send(event.failText.replace("{{username}}", username));
    }
}

// /**
//  * Handle user response from event.
//  */
// function calculateRarity() {
//     const n = Math.random() * 100;
//     let rarity = 1;

//     if (n <= 50) {
//         rarity = 2;
//     }
//     if (n <= 20) {
//         rarity = 3;
//     }

//     return rarity;
// }
