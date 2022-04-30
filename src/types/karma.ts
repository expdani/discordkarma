export enum VOTE_ENUM {
    UPVOTE = "UPVOTE",
    DOWNVOTE = "DOWNVOTE",
}

/**
 * @type with a single currency item from the database.
 */
export type TypeKarmaTotal = {
    user_id: string;
    server_id: string;
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
    vote: VOTE_ENUM;
    updated_at: Date;
    created_at: Date;
};
