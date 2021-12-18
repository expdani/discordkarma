import {getInventory} from ".";
import {Channel, Command} from "./../../types/discord";
import {MessageEmbed, TextChannel, User} from "discord.js";
import {items} from "../../../assets/items.json";
import {wrongMsgs} from "../../../assets/random.json";

/**
 * Says the inventory of the player.
 */
export async function sayInventory(channel: Channel, user: User) {
    try {
        const inventory = JSON.parse((await getInventory(user.id)).inventory);
        let description = "";
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s inventory`, `${user.avatarURL()}`)
            .setColor("#fffff");
        if (inventory.items && inventory.items.length > 0) {
            inventory.items.forEach((item: {id: string; amount: any}) => {
                const currentItem = items.find((x) => x.id.toLowerCase() === item.id.toLowerCase());
                if (currentItem) {
                    description += `**${currentItem?.emoji} ${currentItem?.name}** — ${item.amount}
                                    ${currentItem?.description}\n\n`;
                }
            });
        } else {
            const randomMsg = wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)];
            description = `Je hebt helemaal niks!\n${randomMsg}`;
        }
        embed.description = description;
        channel.send({embeds: [embed]});
    } catch (err) {
        channel.send("Oops, something went wrong processing your inventory.");
    }
}

/**
 * Setup the command that are related to inventory in the bot
 */
export function setupInventoryCommands(command: Command) {
    const messageChannel = command.channel;

    if (messageChannel instanceof TextChannel) {
        sayInventory(messageChannel, command.member?.user as User);
    }
}
