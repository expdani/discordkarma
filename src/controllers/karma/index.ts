import database from "../../database";
import {TypeKarmaPost, TypeKarmaTotal, TypeKarmaTotalInput} from "src/types/karma";

/**
 * Setup karma reaction events
 */
export async function getKarma(userID: string, serverID: string): Promise<TypeKarmaTotal> {
    const karma = await database("karma_total").where({userID, serverID}).first();
    if (!karma) {
        return await initiateKarma(userID, serverID);
    }
    return karma;
}

/**
 * Add a karma record for the user
 */
export async function initiateKarma(userID: string, serverID: string): Promise<TypeKarmaTotal> {
    const now = new Date();
    const input: TypeKarmaTotalInput = {
        userID,
        serverID,
        total: 0,
        created_at: now,
        updated_at: now,
    };

    const [id] = await database("karma_total").insert(input);
    return {...input, id: id};
}

/**
 * Add a karma record for the post
 */
export async function initiateKarmaPost(
    userID: string,
    serverID: string,
    messageID: string,
    authorID: string,
    vote: string,
): Promise<TypeKarmaPost> {
    const now = new Date();
    const post = await database("karma_posts").where({userID, serverID, messageID, authorID}).first();
    if (!post) {
        const input: TypeKarmaPost = {
            userID,
            serverID,
            messageID,
            authorID,
            vote: vote,
            updated_at: now,
            created_at: now,
        };

        return await database("karma_posts").insert(input);
    } else {
        const input: TypeKarmaPost = {
            ...post,
            vote: vote,
            updated_at: now,
        };
        return await database("karma_posts").where({userID, serverID, messageID, authorID}).update(input);
    }
}

/**
 * Remove karma record for the post
 */
export async function removeKarmaPost(userID: string, serverID: string, messageID: string, authorID: string) {
    await database("karma_posts").where({userID, serverID, messageID, authorID}).del();
}

/**
 * Edit the karma of the user.
 * - A positive number adds karma to the user
 * - A negative number removes karma from the user
 */
export async function updateKarma(userID: string, serverID: string, total = 0) {
    const karma = await getKarma(userID, serverID);

    const newKarma = {
        ...karma,
        total: karma.total + total,
    };

    await database("karma_total").where({userID, serverID}).update(newKarma);

    return newKarma;
}
