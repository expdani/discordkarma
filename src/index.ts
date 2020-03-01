import Discord from "discord.js";
import setupMessageListeners from "./listeners/messageListener";
require("dotenv").config();

/**
 * Setup Discord.JS client
 */
export const client = new Discord.Client();
client.login(process.env.DISCORD_API_KEY);

/**
 * Setup listeners
 */
// eslint-disable-next-line no-console
client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));
setupMessageListeners();
