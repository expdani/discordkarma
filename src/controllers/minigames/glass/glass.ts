import {Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, User} from "discord.js";
import {Command} from "../../../types/discord";
import secondsToReadableString, {
    getAmountOfSecondsBetweenDates,
    randomInt,
    reply,
    shuffleArray,
} from "../../../helpers";
import {CURRENCY_SIGN} from "../../../types/currency";
import {changeCurrency, CURRENCY_TYPE} from "../../currency/index";

type GlassData = {
    message?: Message;
    participants: User[];
    running: boolean;
    current: number;
    previousMessage?: string;
    dead: number;
    date?: Date;
};

type GlassCache = {[guildId: string]: GlassData};

const GLASS_GAMES: GlassCache = {};

const TIME_TO_REACT = 10;
const TIME_TO_JOIN = 30;
// 20 min
const GLASS_TIMEOUT = 1200;

/**
 * Start a glass game
 */
export async function startGlassGame(command: Command) {
    if (!command.guild?.id) return;

    const game = GLASS_GAMES[command.guild?.id];
    if (game?.running) reply(command, "A glass bridge game is already running in this server.");

    const lastRequest = GLASS_GAMES[command.guild?.id]?.date;
    if (lastRequest) {
        const secondsBetweenLastRequest = getAmountOfSecondsBetweenDates(new Date(), lastRequest);

        if (secondsBetweenLastRequest < GLASS_TIMEOUT) {
            const secondsWaiting = Math.round(GLASS_TIMEOUT - secondsBetweenLastRequest);
            reply(
                command,
                `You have to wait ${secondsToReadableString(secondsWaiting)}before you can start a glass bridge again.`,
            );
            return;
        }
    }

    GLASS_GAMES[command.guild?.id] = {
        participants: [],
        running: true,
        current: 0,
        dead: 0,
        date: new Date(),
    };

    await getParticipants(command);
}

/**
 * Allow participants to join.
 */
async function getParticipants(command: Command) {
    if (!command.guild) return;

    // Also save message to use for editing.
    if (command instanceof Interaction) reply(command, "Starting..");
    const embed = new MessageEmbed()
        .setTitle("**Glass bridge**")
        .setDescription(
            `Click the (:sunglasses:) emoji below to participate in the upcoming game.\n**Starting in ${TIME_TO_JOIN} seconds!**`,
        )
        .setColor("#fffff");

    await command.channel
        ?.send({
            embeds: [embed],
        })
        .then((sent) => {
            const msg = command.channel?.messages.cache.get(sent.id);
            if (!command.guild?.id) return;
            if (msg) GLASS_GAMES[command.guild?.id].message = msg;
        });

    const msg = GLASS_GAMES[command.guild?.id].message;
    msg?.react("😎");

    // eslint-disable-next-line require-jsdoc
    const filter = (reaction: any, user: User) => {
        return reaction.emoji.name === "😎" && !user.bot;
    };

    const collector = msg?.createReactionCollector({filter, time: TIME_TO_JOIN * 1000});

    collector?.on("collect", (_reaction, user) => {
        if (!command.guild?.id) return;
        if (GLASS_GAMES[command.guild?.id].participants.includes(user)) return;
        GLASS_GAMES[command.guild?.id].participants.push(user);
    });

    collector?.on("end", (_collected, _reason) => {
        if (_reason === "time") runGame(command);
    });
}

/**
 * Begin game.
 */
async function runGame(command: Command) {
    if (!command.guild?.id) return;

    if (!GLASS_GAMES[command.guild?.id].message?.editable) return;
    await GLASS_GAMES[command.guild?.id].message?.reactions.removeAll();
    GLASS_GAMES[command.guild?.id].participants = shuffleArray(GLASS_GAMES[command.guild?.id].participants);
    if (GLASS_GAMES[command.guild?.id].participants.length >= 2) newCollector(command);
    else {
        GLASS_GAMES[command.guild?.id].message?.edit({
            content: "You need at least 2 participants to start a glass bridge game.",
            embeds: [],
        });
        GLASS_GAMES[command.guild?.id].running = false;
        GLASS_GAMES[command.guild?.id].date = undefined;
    }
}

/**
 * Start a new collector.
 */
async function newCollector(command: Command) {
    if (!command.guild?.id) return;

    if (GLASS_GAMES[command.guild?.id].participants.length <= GLASS_GAMES[command.guild?.id].current) {
        return handleEnd(command, "end");
    } else {
        const currentUser = GLASS_GAMES[command.guild?.id].participants[GLASS_GAMES[command.guild?.id].current];

        // eslint-disable-next-line require-jsdoc
        const filter = (i: any) => i.user.id === currentUser.id;

        const collector = command.channel?.createMessageComponentCollector({filter, time: TIME_TO_REACT * 1000});

        let string = `**<@${currentUser.id}> YOUR TURN!**`;
        if (GLASS_GAMES[command.guild?.id].previousMessage)
            string += `\n*${GLASS_GAMES[command.guild?.id].previousMessage}*`;

        const buttons = addButtons();
        const embed = new MessageEmbed().setTitle("**Glass bridge**").setDescription(`${string}`).setColor("#fffff");

        GLASS_GAMES[command.guild?.id].message?.edit({
            embeds: [embed],
            components: [buttons],
        });

        collector?.on("collect", async (_i: any) => {
            handleCollect(_i, command, collector, currentUser, buttons);
        });

        collector?.on("end", async (_collected: any, _reason: string) => {
            handleEnd(command, _reason, currentUser);
        });
    }
}

/**
 * Handle end on collector.
 */
async function handleEnd(command: Command, _reason: string, currentUser?: User) {
    if (!command.guild?.id) return;

    if (_reason === "end") {
        const dead = GLASS_GAMES[command.guild?.id].dead;
        const deadString = dead > 1 ? `${dead} lives were taken (noobs).` : `${dead} dead.`;
        const alive = GLASS_GAMES[command.guild?.id].participants.length;
        const prize = GLASS_GAMES[command.guild?.id].dead * 2.5;
        const prizeString =
            dead >= 1 ? `${alive} survivor(s) will receive the prize pool.` : "No one died, so no prizes.";
        const embed = new MessageEmbed()
            .setTitle("**Glass bridge** (ended)")
            .setDescription(`**Prize pool:** ${CURRENCY_SIGN}${prize}\n${prizeString}\n*${deadString}*`)
            .setColor("#fffff");
        GLASS_GAMES[command.guild?.id].message?.edit({
            embeds: [embed],
        });
        await givePrize(command, prize);
        GLASS_GAMES[command.guild?.id].running = false;
    }

    if (_reason === "time") {
        if (!currentUser) return;
        GLASS_GAMES[command.guild?.id].previousMessage = `<@${currentUser.id}> got pushed off..`;
        GLASS_GAMES[command.guild?.id].participants.shift();
        GLASS_GAMES[command.guild?.id].dead = GLASS_GAMES[command.guild?.id].dead + 1;
        newCollector(command);
    }
}

/**
 * Handle collecting an interaction.
 */
async function handleCollect(_i: any, command: Command, collector: any, currentUser: User, buttons: any) {
    if (!command.guild?.id) return;
    if (!_i.isButton()) return;
    _i.deferUpdate();

    const correct = randomInt(1, 2);

    if (_i.customId === correct.toString()) {
        GLASS_GAMES[command.guild?.id].current = GLASS_GAMES[command.guild?.id].current + 1;
        GLASS_GAMES[command.guild?.id].previousMessage = `<@${currentUser.id}> got it right!`;
    } else {
        GLASS_GAMES[command.guild?.id].participants.shift();
        GLASS_GAMES[command.guild?.id].previousMessage = `<@${currentUser.id}> died.`;
        GLASS_GAMES[command.guild?.id].dead = GLASS_GAMES[command.guild?.id].dead + 1;
    }

    let string = `**<@${currentUser.id}> jumped!**`;
    if (GLASS_GAMES[command.guild?.id].previousMessage)
        string += `\n*${GLASS_GAMES[command.guild?.id].previousMessage}*`;

    const embed = new MessageEmbed().setTitle("**Glass bridge**").setDescription(`${string}`).setColor("#fffff");
    GLASS_GAMES[command.guild?.id].message?.edit({
        embeds: [embed],
        components: [buttons],
    });

    if (GLASS_GAMES[command.guild?.id].participants.length > GLASS_GAMES[command.guild?.id].current) {
        collector.stop("next");
        newCollector(command);
    } else {
        GLASS_GAMES[command.guild?.id].message?.edit({
            embeds: [embed],
            components: [buttons],
        });
        collector.stop("end");
    }
}

/**
 * Add buttons to choose from.
 */
function addButtons(): MessageActionRow {
    const row = new MessageActionRow();

    const glassEmojis: string[] = ["🥃", "🍸", "🍷", "🥛", "🔍", "🔎", "🌡️", "🍹", "🪟"];

    row.addComponents(
        new MessageButton()
            .setCustomId("1")
            .setLabel(glassEmojis[Math.floor(Math.random() * glassEmojis.length)])
            .setStyle("DANGER"),
    );
    row.addComponents(
        new MessageButton()
            .setCustomId("2")
            .setLabel(glassEmojis[Math.floor(Math.random() * glassEmojis.length)])
            .setStyle("DANGER"),
    );

    return row;
}

/**
 * Give the prize money to people.
 */
async function givePrize(command: Command, prize: number) {
    if (!command.guild?.id) return;
    GLASS_GAMES[command.guild?.id].participants.forEach(
        async (user) => await changeCurrency(user.id, CURRENCY_TYPE.BANK, prize),
    );
}
