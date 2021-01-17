/**
 * @type with a single currency item from the database.
 */
export type TypeKarmaTotal = {
    id: number;
    user_id: string;
    server_id: string;
    total: number;
    updated_at: Date;
    created_at: Date;
};

/**
 * @type with a single currency item from the database.
 */
export type TypeKarmaTotalInput = {
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
    user_id: string;
    server_id: string;
    message_id: string;
    author_id: string;
    vote: string;
    updated_at: Date;
    created_at: Date;
};
