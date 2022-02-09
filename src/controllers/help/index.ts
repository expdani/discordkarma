import {COMMAND_PREFIX} from "./../../types/constants";
import {Interaction, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {Command} from "../../types/discord";
import {commands} from "../../../assets/commands.json";
import {reply} from "../../helpers";
import {CATEGORY} from "../../types/category";

// const filterRow = new MessageActionRow().addComponents(getSelectMenu());
const buttonRow = new MessageActionRow().addComponents(getButtonMenu());

const commandList: any = getCommands();
const HELP_TIMEOUT = 60; // seconds
const CMDS_PER_PAGE = 8; // seconds

/**
 * The bot gives a list of commands.
 */
export async function sayHelp(command: Command) {
    try {
        const user = command.member?.user;

        const msg = await sendHelpMessage(command);

        // eslint-disable-next-line require-jsdoc
        const filter = (i: any) => i.user.id === user?.id;

        const collector = command.channel?.createMessageComponentCollector({filter, time: HELP_TIMEOUT * 1000});

        collector?.on("collect", async (i) => {
            handleInteraction(i, command);
        });

        collector?.on("end", (_collected, _reason) => {
            if (msg) disableComponents(msg);
        });
    } catch (err) {
        reply(command, "Oops, something went wrong requesting a list of the commands.");
    }
}

/**
 * Handle button or select interaction.
 */
async function handleInteraction(interaction: any, command: Command) {
    if (!interaction.isMessageComponent) return;
    if (!interaction.isButton && !interaction.isSelectMenu) return;

    const msg = interaction.message;

    interaction.deferUpdate();

    const pageData = getPageData(msg.embeds);
    const currentPage = pageData.page;
    let nextPage = currentPage;

    if (interaction.customId === "next") {
        nextPage = currentPage + 1 < pageData.limit ? currentPage + 1 : pageData.limit;
    }
    if (interaction.customId === "previous") {
        nextPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
    }

    const start = nextPage * CMDS_PER_PAGE - CMDS_PER_PAGE;

    let description = "";
    for (let i = start; i < CMDS_PER_PAGE * nextPage; i++) {
        if (commandList[i] && commandList[i].show) {
            let prefix = COMMAND_PREFIX;
            if (commandList[i].slash && command instanceof Interaction) prefix = "/";
            description += `**${prefix}${commandList[i].text}**\n- ${commandList[i].description}`;

            description += "\n";
        }
    }

    const embed = new MessageEmbed()
        .setTitle("Here's a list of commands you can use!")
        .setColor("#fffff")
        .setDescription(description)
        .setFooter(`Page ${nextPage}/${pageData.limit}`);
    await msg.edit({embeds: [embed], components: msg.components});
}

/**
 * Disable components.
 */
async function disableComponents(message: any) {
    const components: any = [];

    for (const actionRow of message.components) {
        components.push({type: actionRow.type, components: []});
        for (const button of actionRow.components) {
            components[components.length - 1].components.push({
                ...button,
                disabled: true,
            });
        }
    }

    await message.edit({
        components: components,
    });
}

/**
 * Send help message.
 */
async function sendHelpMessage(command: Command) {
    let description = "";
    const embed = new MessageEmbed().setTitle("Here's a list of commands you can use!").setColor("#fffff");

    for (let i = 0; i < CMDS_PER_PAGE; i++) {
        let prefix = COMMAND_PREFIX;
        if (commandList[i].slash && command instanceof Interaction) prefix = "/";
        description += `**${prefix}${commandList[i].text}**\n- ${commandList[i].description}`;

        description += "\n";
    }

    const pageLimit = Math.ceil(commandList.length / CMDS_PER_PAGE);

    embed.setFooter(`Page ${1}/${pageLimit}`);
    embed.setDescription(description);

    const buttons = pageLimit > 1 ? buttonRow : null;
    return reply(command, {embeds: [embed], components: [buttons]});
}

/**
 * Setup buttons.
 */
function getButtonMenu(): MessageButton[] {
    const row: MessageButton[] = [
        new MessageButton().setCustomId("previous").setStyle("PRIMARY").setEmoji("⬅️"),
        new MessageButton().setCustomId("next").setStyle("PRIMARY").setEmoji("➡️"),
    ];

    return row;
}

/**
 * Get help page.
 */
export function getPageData(embed: MessageEmbed[]): {page: number; limit: number} {
    const pageText = embed[0].footer?.text.split(" ");

    if (!pageText) return {page: 1, limit: 1};
    const pageNumbers = pageText[1]?.split("/");

    if (pageNumbers) return {page: parseInt(pageNumbers[0]), limit: parseInt(pageNumbers[1])};

    return {page: 1, limit: 1};
}

/**
 * Get all available commands.
 */
export function getCommands() {
    const cmds: any = [];

    for (let i = 0; i < commands.length; i++) {
        if (commands[i].show && commands[i].category !== CATEGORY.admin) cmds.push(commands[i]);
    }

    return cmds;
}

// /**
//  * Get all categories.
//  */
// function getSelectMenu(): MessageSelectMenu {
//     const menu: MessageSelectMenu = new MessageSelectMenu()
//         .setCustomId("select")
//         .setPlaceholder("Filter on category")
//         .setMinValues(1)
//         .setMaxValues(1);

//     for (let i = 0; i < HELP_CATEGORIES.length; i++) {
//         if (HELP_CATEGORIES[i]) {
//             menu.addOptions({
//                 label: HELP_CATEGORIES[i],
//                 value: HELP_CATEGORIES[i],
//             });
//         }
//     }

//     return menu;
// }
