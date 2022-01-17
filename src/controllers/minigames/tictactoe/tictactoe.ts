/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import {reply, randomInt} from "../../../helpers";
import {Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, User} from "discord.js";
import {Command} from "../../../types/discord";
import {getInteractionAttribute, getMessageAttribute} from "../../../commandHandler";
import {TypeMessageResponse} from "../../../types/response";
import {changeCurrency, getCurrency} from "../../currency/index";
import {CURRENCY_SIGN} from "../../../types/currency";

type TictactoeData = {
    author: User;
    target: User;
    turn: User | null;
    winner?: User;
    bet?: number;
};

type TictactoeCache = {[commandId: string]: TictactoeData};

const TTT_GAMES: TictactoeCache = {};
// 300 seconds (5 min)
const TTT_DURATION = 300;
const REQUEST_DURATION = 30;

/**
 * Play tic tac toe
 */
export async function initiateTicTacToe(command: Command, response: TypeMessageResponse) {
    if (!command.member?.user) return;

    try {
        if (command instanceof Message || command.isCommand) {
            const targetUser =
                command instanceof Message
                    ? command.mentions.users.first()
                    : (getInteractionAttribute(response, "user") as User);

            const bet =
                command instanceof Message
                    ? getMessageAttribute(response, 1)
                    : (getInteractionAttribute(response, "bet") as number);

            const authorWallet = (await getCurrency(command.member?.user.id)).wallet;

            if (targetUser && targetUser != (command.member.user as User) && !targetUser.bot) {
                if (bet) {
                    if (authorWallet >= bet) {
                        sendRequest(command, targetUser, bet);
                    } else {
                        reply(command, `You don't have enough money in your wallet to bet ${CURRENCY_SIGN}${bet}.`);
                    }
                } else {
                    sendRequest(command, targetUser, bet);
                }
            } else {
                reply(command, "Mention a valid opponent. Bots and yourself are not valid.");
            }
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Ask player if it wants to play.
 */
async function sendRequest(command: Command, targetUser: User, bet: any) {
    if (!command.member?.user) return;

    let string = `<@${targetUser.id}>, do you want to play against <@${command.member?.user.id}>?`;
    if (bet) string += `\n**BET: ${CURRENCY_SIGN}${bet}**`;
    const embed = new MessageEmbed().setTitle("**Tic Tac Toe**").setDescription(`${string}`).setColor("#fffff");
    const buttons = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("accept").setLabel("Accept").setStyle("SUCCESS"),
        new MessageButton().setCustomId("decline").setLabel("Decline").setStyle("DANGER"),
    );

    reply(command, {embeds: [embed], components: [buttons]});

    /**
     * Only handle interaction if user is author or target.
     */
    const filter = (i: any) => i.user.id === targetUser.id;
    const collector = command.channel?.createMessageComponentCollector({filter, time: REQUEST_DURATION * 1000});

    collector?.on("collect", async (i) => {
        if (!i.isButton) return;
        if (!i.isMessageComponent()) return;
        await i.deferUpdate();

        if (i.customId === "accept") {
            await collector.stop("accept");
            const targetWallet = (await getCurrency(targetUser.id)).wallet;

            if (bet) {
                if (targetWallet >= bet) startCollector(i, command, targetUser, bet);
                else {
                    const embed = new MessageEmbed()
                        .setTitle("**Tic Tac Toe**")
                        .setDescription(`<@${targetUser.id}> does not have enough money to bet ${CURRENCY_SIGN}${bet}.`)
                        .setColor("#fffff");

                    i.editReply({embeds: [embed], components: []});
                }
            } else {
                startCollector(i, command, targetUser, bet);
            }
        } else {
            await collector.stop("decline");
            const embed = new MessageEmbed()
                .setTitle("**Tic Tac Toe**")
                .setDescription(`<@${targetUser.id}> declined.`)
                .setColor("#fffff");

            i.editReply({embeds: [embed], components: []});
        }
    });
}

/**
 * Start collector
 */
async function startCollector(_i: any, command: Command, targetUser: User, bet: any) {
    if (!command.member?.user) return;

    await sendTicTacToe(_i, command, command.member.user as User, targetUser, bet);

    /**
     * Only handle interaction if user is author or target.
     */
    const filter = (i: any) => i.user.id === command.member?.user.id || i.user.id === targetUser.id;
    const collector = command.channel?.createMessageComponentCollector({filter, time: TTT_DURATION * 1000});

    if (bet) {
        await changeCurrency((command.member.user as User).id, -bet);
        await changeCurrency(targetUser.id, -bet);
    }

    collector?.on("collect", async (i) => {
        handleInteraction(i, command, collector);
    });

    collector?.on("end", async (_collected, _reason) => {
        if (_reason === "time") {
            handleTimeout(_i, command, targetUser, bet);
        }
    });
}

/**
 * Handle timeout
 */
async function handleTimeout(_i: any, command: Command, targetUser: User, bet: any) {
    if (!TTT_GAMES[command.id]) return;
    if (!command.member?.user) return;

    TTT_GAMES[command.id].winner =
        TTT_GAMES[command.id].turn === targetUser ? (command.member?.user as User) : targetUser;
    const loser = TTT_GAMES[command.id].winner === targetUser ? (command.member?.user as User) : targetUser;
    if (TTT_GAMES[command.id].winner) await changeCurrency((TTT_GAMES[command.id].winner as User).id, bet * 2);

    const embed = new MessageEmbed()
        .setTitle("**Tic Tac Toe**")
        .setDescription(
            `<@${loser.id}> timed out.\n<@${TTT_GAMES[command.id].winner?.id}> won the bet of ${CURRENCY_SIGN}${bet}`,
        )
        .setColor("#fffff");

    _i.editReply({embeds: [embed], components: []});
}

/**
 * Handle an interaction
 */
async function handleInteraction(i: Interaction, command: Command, collector: any) {
    try {
        if (!i.isButton()) return;
        await i.deferUpdate();
        const game = TTT_GAMES[command.id];
        if (i.user.id === game.turn?.id) {
            TTT_GAMES[command.id].turn = game.turn.id === game.author.id ? game.target : game.author;
            updateGrid(i, command, game, collector);
        }
    } catch (err) {
        i.channel?.send("Oops, something went wrong processing your action.");
    }
}

/**
 * Update a grid
 */
async function updateGrid(interaction: any, command: Command, game: TictactoeData, collector: any) {
    try {
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

        const msgComponents: MessageActionRow[] = [];

        for (const actionRow of message.components) {
            msgComponents.push(new MessageActionRow());
            for (const button of actionRow.components) {
                msgComponents[msgComponents.length - 1].addComponents(
                    new MessageButton().setCustomId(button.customId).setLabel(button.label).setStyle(button.style),
                );
            }
        }

        const string = `<@${game.author.id}> vs <@${game.target.id}>.\n<@${game.turn?.id}>'s turn!`;
        const embed = new MessageEmbed().setTitle("**Tic Tac Toe**").setDescription(`${string}`).setColor("#fffff");

        await message.edit({
            components: msgComponents,
            embeds: [embed],
        });

        checkWin(interaction, command, message, game, collector);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Send grid and save game to cache.
 */
async function sendTicTacToe(_i: any, command: Command, author: User, target: User, bet: any) {
    const i = randomInt(1, 2);
    const turn: User = i === 1 ? author : target;

    let string = `**<@${turn.id}>'s turn!**`;
    if (bet) string += `\nBET: ${CURRENCY_SIGN}${bet}`;
    const embed = new MessageEmbed()
        .setTitle("**Tic Tac Toe**")
        .setDescription(`${string}`)
        .setColor("#fffff")
        .setFooter(`${author.tag} vs ${target.tag}\n/help tictactoe`);

    const components = [
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
    ];

    _i.editReply({
        embeds: [embed],
        components: components,
    });

    TTT_GAMES[command.id] = {
        target,
        author,
        turn,
        bet,
    };
}

/**
 * Check if there is a winner.
 */
async function checkWin(interaction: any, command: Command, message: any, game: TictactoeData, collector: any) {
    try {
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
            return true;
        }
        if (isWinner(buttons, letter)) {
            TTT_GAMES[command.id].winner = interaction.user.id;
            const string = `**<@${interaction.user.id}> is the winner!**`;
            const embed = new MessageEmbed()
                .setTitle("**Tic Tac Toe**")
                .setDescription(`${string}`)
                .setColor("#fffff")
                .setFooter(`${game.author.tag} vs ${game.target.tag}\n/help tictactoe`);

            const bet = TTT_GAMES[command.id].bet;
            if (bet && TTT_GAMES[command.id].winner) {
                await changeCurrency(interaction.user.id, bet * 2);
            }
            await message.edit({embeds: [embed]});
            disableAllButtons(message);
            collector.stop("winner");
            return true;
        } else {
            enableAllButtons(message);
            return false;
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
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
