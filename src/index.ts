import Discord from "discord.js";

const client = new Discord.Client();
require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_API_KEY);
