"use client"
import { JWT_TOKEN_KEY, ROLE_KEY } from '@/constants/auth.constants';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloLink } from '@apollo/client';

// HTTP link
const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_URI
})


// Add Authorization header
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(JWT_TOKEN_KEY)
    let newHeaders = { ...headers }
    if (token) {
        newHeaders = {
            ...newHeaders,
            authorization: `Bearer ${token}`
        }
    }
    return {
        headers: newHeaders
    }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {

    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (
                err.message === 'Authentication failed: User matching query does not exist.' ||
                err.message === 'Your account is inactive.' ||
                err.message === 'Authentication failed: Your token is expired.' ||
                err.message === 'Invalid authorization header format.' ||
                err.message === 'You are not authenticated.' ||
                err.message === 'You do not have the required permissions to access this resource'
            ) {
                localStorage.removeItem(JWT_TOKEN_KEY); // Remove token
                localStorage.removeItem(ROLE_KEY); // Remove role
            }
        }
    }
    if (networkError) console.error(`[Network error]: ${networkError}`);
});

const createApolloClient = () => {

    return new ApolloClient({
        // link: authLink.concat(httpLink),
        link: ApolloLink.from([errorLink, authLink, httpLink]),

        cache: new InMemoryCache()
    })
}

export default createApolloClient;


