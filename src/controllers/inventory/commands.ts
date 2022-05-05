import {getInventory} from "./index";
import {Channel, Command} from "../../types/discord";
import {MessageEmbed, TextChannel, User} from "discord.js";
import {wrongMsgs} from "../../../assets/random.json";
import {TypeInventoryItem} from "src/types/inventory";
import {apolloClient} from "../../apollo/index";
import {GET_ITEMS} from "./gql";

/**
 * Says the inventory of the player.
 */
export async function sayInventory(channel: Channel, user: User) {
    try {
        const inventoryObj = await getInventory(user.id);
        if (!inventoryObj) return channel.send("Oops, something went wrong processing your inventory.");

        const inventory = inventoryObj.inventory;
        let description = "";
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s inventory`, `${user.avatarURL()}`)
            .setColor("#fffff");
        if (inventory.items && inventory.items.length > 0) {
            const itemIds: string[] = [];

            inventory.items.forEach((item: TypeInventoryItem) => {
                itemIds.push(item.id);
            });

            const {data} = await apolloClient.query({
                query: GET_ITEMS,
                variables: {items: JSON.stringify(itemIds)},
            });

            const invItems = data.getItems;

            inventory.items.forEach((item: {id: string; amount: any}) => {
                const currentItem = invItems.find((x: any) => x.id.toLowerCase() === item.id.toLowerCase());
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
