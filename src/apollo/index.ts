/* eslint-disable no-console */
import "cross-fetch/polyfill";
import {env} from "../../environment";
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";
import {setContext} from "@apollo/client/link/context";

/**
 * Setup Apollo client
 */
const httpLink = createHttpLink({
    uri: env.API_ENDPOINT,
});

const authLink = setContext((_, {headers}) => {
    return {
        headers: {
            ...headers,
            authorization: env.API_SECRET,
        },
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: "network-only",
        },
    },
});
