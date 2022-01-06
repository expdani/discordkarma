import Discord from "discord.js";
import setupMessageListeners from "./listeners/messageListener";
import {env} from "../environment";
import setupReactionListeners from "./listeners/reactionListener";
import registerCommands from "./commandSetup";

/**
 * Setup Discord.JS client
 */
export const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
});
client.login(env.DISCORD_API_KEY || process.env.DISCORD_API_KEY);

/**
 * Setup listeners
 */
// eslint-disable-next-line no-console
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    registerCommands(client);
});

setupMessageListeners();
setupReactionListeners();
