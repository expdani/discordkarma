import {CacheType, CommandInteractionOption} from "discord.js";

export type TypeMessageResponse = {
    input: {
        text: string;
        attributes: Array<string> | readonly CommandInteractionOption<CacheType>[];
        fullCommand?: string;
    };
    parameters?: {};
    response?: string;
    command: TypeCommand | null | undefined;
    show?: boolean;
};

export type TypeCommand = {
    text: string;
    aliases?: Array<string>;
    description: string;
    usage: string;
    intent?: string;
    sub?: Array<TypeSubCommand>;
    options?: Array<TypeCommandOption>;
    slash?: boolean;
};

export type TypeCommandOption = {
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<TypeChoices>;
};

export type TypeChoices = {
    name: string;
    value: string;
};

export type TypeSubCommand = {
    text: string;
    aliases?: Array<string>;
    description: string;
    usage: string;
    intent?: string;
};
