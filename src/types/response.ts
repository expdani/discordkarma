export type TypeCommandInputResponse = {
    input: {
        text: string;
        attributes: Array<string>;
        fullCommand: string;
    };
    parameters?: {};
    response?: string;
    command: TypeCommand | null;
};

export type TypeCommand = {
    text: string;
    aliases?: Array<string>;
    description: string;
    usage: string;
    intent?: string;
};
