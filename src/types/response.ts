export type TypeMessageResponse = {
    input: {
        text: string;
        attributes: Array<string>;
        fullCommand: string;
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
};

export type TypeSubCommand = {
    text: string;
    aliases?: Array<string>;
    description: string;
    usage: string;
    intent?: string;
};
