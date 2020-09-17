export type TypeMessageResponse = {
    input: {
        text: string;
        attributes: string[];
        fullCommand: string;
    };
    parameters?: {};
    response?: string;
    command: TypeCommand | null;
};

export type TypeCommand = {
    command: string;
    aliases?: string[];
    description: string;
    usage: string;
    intent?: string;
};
