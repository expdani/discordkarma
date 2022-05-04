/**
 * @type the rewards.
 */
export type TypeRewards = {
    wallet?: number;
    bank?: number;
    items?: [
        {
            id: string;
            amount?: number;
        },
    ];
};
