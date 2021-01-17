/**
 * @type with a single currency item from the database.
 */
export type TypeKarmaTotal = {
    id: number;
    userID: string;
    serverID: string;
    total: number;
    updated_at: Date;
    created_at: Date;
};

/**
 * @type with a single currency item from the database.
 */
export type TypeKarmaTotalInput = {
    userID: string;
    serverID: string;
    total: number;
    updated_at: Date;
    created_at: Date;
};

/**
 * @type with a single currency item from the database.
 */
export type TypeKarmaPost = {
    userID: string;
    serverID: string;
    messageID: string;
    authorID: string;
    vote: string;
    updated_at: Date;
    created_at: Date;
};
