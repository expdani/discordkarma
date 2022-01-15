/* eslint-disable complexity */
import {reply, randomInt} from "../../../helpers";
import {Interaction, Message, MessageEmbed, User} from "discord.js";
import {Command} from "../../../types/discord";
import {getInteractionAttribute} from "../../../commandHandler";
import {TypeMessageResponse} from "../../../types/response";

type TictactoeData = {
    message?: Message;
    author: User;
    target: User;
    turn: User | null;
    winner?: User;
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

        if (targetUser && targetUser != (command.member?.user as User) && !targetUser.bot) {
            await sendTicTacToe(command, command.member?.user as User, targetUser);

            /**
             * Only handle interaction if user is author or target.
             */
            const filter = (i: any) => i.user.id === command.member?.user.id || i.user.id === targetUser.id;
            const collector = command.channel?.createMessageComponentCollector({filter, time: 300000});

            collector?.on("collect", async (i) => {
                handleInteraction(i, command, collector);
            });
        } else {
            reply(command, "Mention a valid opponent. Bots and yourself are not valid.");
        }
    }
}

/**
 * Handle an interaction
 */
async function handleInteraction(i: Interaction, command: Command, collector: any) {
    try {
        if (!i.isButton()) return;
        const game = TTT_GAMES[command.id];
        if (i.user.id === game.turn?.id) {
            TTT_GAMES[command.id].turn = game.turn.id === game.author.id ? game.target : game.author;
            updateGrid(i, game, collector);
        }
    } catch (err) {
        i.channel?.send("Oops, something went wrong processing your action.");
    }
}

/**
 * Update a grid
 */
async function updateGrid(interaction: any, game: TictactoeData, collector: any) {
    if (!interaction.isMessageComponent()) return;
    const message = interaction.message;

    if (!interaction.isButton()) return;
    if (!message.components) return;

    disableAllButtons(message);

    const i = parseInt(interaction.customId[3]);
    const j = parseInt(interaction.customId[4]);

    const buttonPressed = message.components[i - 1].components[j - 1];

    if (buttonPressed.label !== "_") return;

    buttonPressed.label = interaction.user.id === game.author.id ? "X" : "O";
    buttonPressed.style = interaction.user.id === game.author.id ? "SUCCESS" : "DANGER";

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
                customId: button.customId,
                disabled: true,
            });
        }
    }

    await interaction.deferUpdate();

    const string = `<@${game.author.id}> vs <@${game.target.id}>.\n<@${game.turn?.id}>'s turn!`;
    const embed = new MessageEmbed().setTitle("**Tic Tac Toe**").setDescription(`${string}`).setColor("#fffff");

    await message.edit({
        embeds: [embed],
        components: [components],
    });

    checkWin(interaction, message, game, collector);
}

/**
 * Send grid and save game to cache.
 */
async function sendTicTacToe(command: Command, author: User, target: User) {
    const i = randomInt(1, 2);
    const turn: User = i === 1 ? author : target;

    const string = `**<@${turn.id}>'s turn!**`;
    const embed = new MessageEmbed()
        .setTitle("**Tic Tac Toe**")
        .setDescription(`${string}`)
        .setColor("#fffff")
        .setFooter(`${author.tag} vs ${target.tag}\n/help tictactoe`);

    reply(command, {
        embeds: [embed],
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

    TTT_GAMES[command.id] = {
        target,
        author,
        turn,
    };
}

/**
 * Check if there is a winner.
 */
async function checkWin(interaction: any, message: any, game: TictactoeData, collector: any) {
    if (!message.components) return;

    const buttons: {label: string; id: string}[] = [];
    let empty = 0;

    for (const actionRow of message.components) {
        for (const button of actionRow.components) {
            if (button.label === "_") empty++;
            buttons.push({
                label: button.label,
                id: button.customId as string,
            });
        }
    }

    const letter = interaction.user.id === game.author.id ? "X" : "O";

    if (!isWinner(buttons, letter) && empty === 0) {
        const string = "**Draw!**";
        const embed = new MessageEmbed()
            .setTitle("**Tic Tac Toe**")
            .setDescription(`${string}`)
            .setColor("#fffff")
            .setFooter(`${game.author.tag} vs ${game.target.tag}\n/help tictactoe`);
        await message.edit({embeds: [embed]});
        disableAllButtons(message);
        collector.stop("winner");
    }
    if (isWinner(buttons, letter)) {
        game.winner = interaction.user.id;
        const string = `**<@${interaction.user.id}> is the winner!**`;
        const embed = new MessageEmbed()
            .setTitle("**Tic Tac Toe**")
            .setDescription(`${string}`)
            .setColor("#fffff")
            .setFooter(`${game.author.tag} vs ${game.target.tag}\n/help tictactoe`);
        await message.edit({embeds: [embed]});
        disableAllButtons(message);
        collector.stop("winner");
    } else enableAllButtons(message);
}

/**
 * Check grid if there are 3 in a row.
 */
function isWinner(buttons: any, letter: string) {
    if (
        // horizontal
        (buttons[0].label === letter && buttons[1].label === letter && buttons[2].label === letter) ||
        (buttons[3].label === letter && buttons[4].label === letter && buttons[5].label === letter) ||
        (buttons[6].label === letter && buttons[7].label === letter && buttons[8].label === letter) ||
        // vertical
        (buttons[0].label === letter && buttons[3].label === letter && buttons[6].label === letter) ||
        (buttons[1].label === letter && buttons[4].label === letter && buttons[7].label === letter) ||
        (buttons[2].label === letter && buttons[5].label === letter && buttons[8].label === letter) ||
        // cross
        (buttons[0].label === letter && buttons[4].label === letter && buttons[8].label === letter) ||
        (buttons[6].label === letter && buttons[4].label === letter && buttons[2].label === letter)
    )
        return true;
}

/**
 * Disable all buttons in a message.
 */
async function disableAllButtons(message: any) {
    const components: any = [];
    for (const actionRow of message.components) {
        components.push({type: actionRow.type, components: []});
        for (const button of actionRow.components) {
            components[components.length - 1].components.push({
                type: button.type,
                label: button.label,
                style: button.style,
                customId: button.customId,
                disabled: true,
            });
        }
    }

    await message.edit({
        components: components,
    });
}

/**
 * Enable all buttons in a message.
 */
async function enableAllButtons(message: any) {
    const components: any = [];
    for (const actionRow of message.components) {
        components.push({type: actionRow.type, components: []});
        for (const button of actionRow.components) {
            components[components.length - 1].components.push({
                type: button.type,
                label: button.label,
                style: button.style,
                customId: button.customId,
                disabled: false,
            });
        }
    }

    await message.edit({
        components: components,
    });
}
