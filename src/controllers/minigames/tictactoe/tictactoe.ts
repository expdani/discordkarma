import {ButtonInteraction, Interaction, MessageButton, MessageSelectMenu} from "discord.js";
import {reply} from "src/helpers";
import {Command} from "../../../types/discord";

/**
 * Play tic tac toe
 */
export async function initiateTicTacToe(command: Command) {
    if (command instanceof Interaction && command.isButton() && command.customId.startsWith("ttt")) {
        await updateGrid(command);
    } else {
        reply(command, {
            components: [
                {
                    type: 1,
                    components: [
                        {type: 2, label: "_", style: 2, custom_id: "ttt11"},
                        {type: 2, label: "_", style: 2, custom_id: "ttt12"},
                        {type: 2, label: "_", style: 2, custom_id: "ttt13"},
                    ],
                },
                {
                    type: 1,
                    components: [
                        {type: 2, label: "_", style: 2, custom_id: "ttt21"},
                        {type: 2, label: "_", style: 2, custom_id: "ttt22"},
                        {type: 2, label: "_", style: 2, custom_id: "ttt23"},
                    ],
                },
                {
                    type: 1,
                    components: [
                        {type: 2, label: "_", style: 2, custom_id: "ttt31"},
                        {type: 2, label: "_", style: 2, custom_id: "ttt32"},
                        {type: 2, label: "_", style: 2, custom_id: "ttt33"},
                    ],
                },
            ],
        });
    }
}

/**
 * Update a grid
 */
async function updateGrid(interaction: any) {
    if (!interaction.isMessageComponent()) return;
    const message = interaction.message;

    let xs = 0;
    let os = 0;

    if (!interaction.isButton()) return;
    if (!message.components) return;

    for (const actionRow of message.components) {
        for (const button of actionRow.components) {
            if (button.label === "X") xs++;
            else if (button.label === "O") os++;
        }
    }

    const xs_turn = xs <= os;
    const i = parseInt(interaction.customId[3]);
    const j = parseInt(interaction.customId[4]);

    const buttonPressed = message.components[i - 1].components[j - 1];

    if (buttonPressed.label !== "_") return;

    buttonPressed.label = xs_turn ? "X" : "O";
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

    // eslint-disable-next-line require-jsdoc
    const styleToNumber = (style: string) => (style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4);

    const components = [];

    for (const actionRow of message.components) {
        components.push({type: 1, components: []});
        for (const button of actionRow.components) {
            components[components.length - 1].components.push({
                type: 2,
                label: button.label,
                style: styleToNumber(button.style),
                custom_id: button.customID,
            });
        }
    }

    await message.edit({components: components});

    await interaction.deferUpdate();
}
