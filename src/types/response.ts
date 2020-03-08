export type TypeMessageResponse = {
    input: {
        text: string;
        attributes: [string];
        fullCommand: string;
    };
    response?: string;
    command: TypeCommand;
};

export type TypeCommand = {
    command: string;
    aliases?: [string];
    description: string;
    usage: string;
    intent?: string;
};
