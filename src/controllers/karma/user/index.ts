import {TypeKarmaPost, TypeKarmaTotal, VOTE_ENUM} from "../../../types/karma";
import {ADD_KARMA, CREATE_KARMA_POST, DELETE_KARMA_POST, GET_USER_KARMA} from "../gql";
import {apolloClient} from "../../../apollo";

/**
 * Get user karma
 */
export async function getKarma(user_id: string, server_id: string): Promise<TypeKarmaTotal> {
    const {data} = await apolloClient.query({
        query: GET_USER_KARMA,
        variables: {user_id, server_id},
    });

    return data.getUserKarma;
}

/**
 * Add a karma record for the post
 */
export async function initiateKarmaPost(
    user_id: string,
    server_id: string,
    message_id: string,
    author_id: string,
    vote: VOTE_ENUM,
): Promise<TypeKarmaPost> {
    const {data} = await apolloClient.mutate({
        mutation: CREATE_KARMA_POST,
        variables: {user_id, server_id, message_id, author_id, vote},
    });

    return data.createKarmaPost;
}

/**
 * Remove karma record for the post
 */
export async function removeKarmaPost(user_id: string, server_id: string, message_id: string, author_id: string) {
    await apolloClient.mutate({
        mutation: DELETE_KARMA_POST,
        variables: {user_id, server_id, message_id, author_id},
    });
}

/**
 * Edit the karma of the user.
 * - A positive number adds karma to the user
 * - A negative number removes karma from the user
 */
export async function updateKarma(user_id: string, server_id: string, amount = 0) {
    const {data} = await apolloClient.mutate({
        mutation: ADD_KARMA,
        variables: {user_id, server_id, amount},
    });

    return data.addKarma;
}
