import {reply, randomInt} from "../../../helpers";
import {Interaction, Message, MessageActionRow, MessageButton, User} from "discord.js";
import {Command} from "../../../types/discord";
import {getInteractionAttribute} from "../../../commandHandler";
import {TypeMessageResponse} from "../../../types/response";

type TictactoeData = {
    message?: Message;
    author: User;
    target: User;
    turn: User | null;
};

type TictactoeCache = {[commandId: string]: TictactoeData};

const TTT_GAMES: TictactoeCache = {};

/**
 * Play tic tac toe
 */
export async function initiateTicTacToe(command: Command, response: TypeMessageResponse) {
    // if (command instanceof Interaction && command.isButton() && command.customId.startsWith("ttt")) {

    if (command instanceof Message || command.isCommand) {
        const targetUser =
            command instanceof Message
                ? command.mentions.users.first()
                : (getInteractionAttribute(response, "user") as User);

        if (targetUser) {
            await sendTicTacToe(command, command.member?.user as User, targetUser);

            const filter = (i: any) => i.user.id === command.member?.user.id || i.user.id === targetUser.id;
            const collector = command.channel?.createMessageComponentCollector({filter, time: 30000});

            collector?.on("collect", async (i) => {
                handleInteraction(i, command);
            });
        }
    }
}

async function handleInteraction(i: Interaction, command: Command) {
    try {
        if (!i.isButton()) return;
        const game = TTT_GAMES[command.id];
        if (i.user.id === game.turn?.id) updateGrid(i);
    } catch (err) {
        i.channel?.send("Oops, something went wrong processing your action.");
    }
}

async function sendTicTacToe(command: Command, author: User, target: User) {
    const i = randomInt(1, 2);
    const turn = i === 1 ? author : target;

    reply(command, {
        content: "Fight!",
        components: [getComponents()],
    });

    TTT_GAMES[command.id] = {
        target,
        author,
        turn,
    };
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

    const components: any = [];

    for (const actionRow of message.components) {
        components.push({type: 1, components: []});
        for (const button of actionRow.components) {
            components[components.length - 1].components.push({
                type: 2,
                label: button.label,
                style: styleToNumber(button.style),
                customId: button.customID,
            });
        }
    }

    await message.edit({components: components});

    await interaction.deferUpdate();
}

function getComponents(): any[] {
    const r1 = new MessageActionRow();
    const r2 = new MessageActionRow();
    const r3 = new MessageActionRow();
    r1.addComponents(new MessageButton().setCustomId(`ttt11`).setLabel(`_`).setStyle(2));
    r1.addComponents(new MessageButton().setCustomId(`ttt12`).setLabel(`_`).setStyle(2));
    r1.addComponents(new MessageButton().setCustomId(`ttt13`).setLabel(`_`).setStyle(2));
    r2.addComponents(new MessageButton().setCustomId(`ttt21`).setLabel(`_`).setStyle(2));
    r2.addComponents(new MessageButton().setCustomId(`ttt22`).setLabel(`_`).setStyle(2));
    r2.addComponents(new MessageButton().setCustomId(`ttt23`).setLabel(`_`).setStyle(2));
    r3.addComponents(new MessageButton().setCustomId(`ttt31`).setLabel(`_`).setStyle(2));
    r3.addComponents(new MessageButton().setCustomId(`ttt32`).setLabel(`_`).setStyle(2));
    r3.addComponents(new MessageButton().setCustomId(`ttt33`).setLabel(`_`).setStyle(2));

    return [r1, r2, r3];
}
