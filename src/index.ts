import Discord from "discord.js";
import setupMessageListeners from "./listeners/messageListener";
import {env} from "../environment";
import setupReactionListeners from "./listeners/reactionListener";

/**
 * Setup Discord.JS client
 */
export const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
client.login(env.DISCORD_API_KEY);

/**
 * Setup listeners
 */
// eslint-disable-next-line no-console
client.on("ready", () => console.log(`Logged in as ${client.user?.tag}!`));

setupMessageListeners();
setupReactionListeners();
