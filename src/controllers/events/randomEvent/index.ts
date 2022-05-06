import {Collection, Guild, Message} from "discord.js";
import {changeCurrency, CURRENCY_TYPE} from "../../currency";
import {addItemToInventory} from "../../inventory/index";
import {getAmountOfSecondsBetweenDates} from "../../../helpers";
import {apolloClient} from "../../../apollo/index";
import {GET_RANDOM_MESSAGE_EVENT} from "./gql";
import {TypeRewards} from "../../../types/randomEvent";
import {getGlobalSettings, getServerSettings} from "../../settings/index";

const PERCENT_CHANCE_PER_MESSAGE = 0.43;

const EVENT_TIMEOUT = 10; // seconds

type TimeoutCache = {[serverID: string]: Date};

/**
 * Object with triggered events. This object stores server ID's and the last time when an event was triggered
 * Server events can only trigger once every EVENT_TIMEOUT seconds
 */
const SERVER_TIMEOUTS: TimeoutCache = {};

/**
 * Calculate a random event and handle it.
 */
export default async function calculateRandomEvent(message: Message) {
    if (message.author.bot) return;
    if (!message?.guild?.id) return;

    const globalSettings = await getGlobalSettings();
    if (!globalSettings.random_event.enabled) return;

    const n = Math.random() * 100;

    const chance = globalSettings.random_event.percent_change_per_message || PERCENT_CHANCE_PER_MESSAGE;

    if (n <= chance) {
        const settings = await getServerSettings(message.guild.id);
        if (!settings.random_message_events_enabled) return;

        let guild: Guild | null = null;
        if (message.guild) guild = message.guild;
        else return;

        const lastRequest = SERVER_TIMEOUTS[guild.id];
        if (lastRequest) {
            if (getAmountOfSecondsBetweenDates(new Date(), lastRequest) < EVENT_TIMEOUT) return;
        }

        const messageChannel = message.channel;

        const {data} = await apolloClient.query({
            query: GET_RANDOM_MESSAGE_EVENT,
        });

        const event = data.getRandomMessageEvent;

        if (!event) return;
        messageChannel.send(event.text);

        /**
         * Await line
         */
        const filter = (response: Message) =>
            Boolean(response.content.toLowerCase().includes(event.answer.toLowerCase()) && !response.author.bot);

        // Errors: ['time'] treats ending because of the time limit as an error
        messageChannel
            .awaitMessages({filter, max: 1, time: event.timeLimit * 1000, errors: ["time"]})
            .then((collectedMessages: Collection<string, Message>) => {
                handleUserResponse(collectedMessages, event);
            })
            .catch(() => messageChannel.send(event.failText));

        if (guild) SERVER_TIMEOUTS[guild.id] = new Date();
    }
}

/**
 * Handle user response from event.
 */
async function handleUserResponse(collectedMessages: Collection<string, Message>, event: any) {
    const message = collectedMessages.first();
    const username = (await message?.guild?.members.fetch(message.author.id))?.nickname || message?.author.username;

    if (!message?.author.id) return;
    try {
        const rewards: TypeRewards = event.rewards;
        if (rewards) {
            if (rewards.wallet && rewards.wallet > 0) {
                await changeCurrency(message.author.id, CURRENCY_TYPE.WALLET, rewards.wallet);
            }
            if (rewards.bank && rewards.bank > 0) {
                await changeCurrency(message.author.id, CURRENCY_TYPE.BANK, rewards.bank);
            }
            if (rewards.items) {
                rewards.items.forEach(async (item) => {
                    await addItemToInventory(message.author.id, item.id, item.amount || 1);
                });
            }

            await message.reply(event.successText.replace("{{username}}", username));
        }
    } catch (err) {
        console.log(err);
        message.channel.send(event.failText.replace("{{username}}", username));
    }
}
