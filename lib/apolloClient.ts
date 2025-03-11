"use client"
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloLink } from '@apollo/client';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { USER_TYPE } from '@/graphql/accounts';

// HTTP link
const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_URI
})


// Add Authorization header
const authLink = setContext( async(_, { headers }) => {
     type CustomSession = Session & {
         token?: string;
         user?: USER_TYPE;
     };
     const session = await getSession() as CustomSession | null;
     const token = session?.token ||"";
    
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

const errorLink = onError(({ graphQLErrors, networkError,operation, forward }) => {
    if (graphQLErrors) {
        // const router = useRouter()
        for (const err of graphQLErrors) {
            if (
                err.message ===
                    'Authentication failed: User matching query does not exist.' ||
                err.message === 'Your account is inactive.' ||
                err.message ===
                    'Authentication failed: Your token is expired.' ||
                err.message === 'Invalid authorization header format.' ||
                err.message === 'You are not authenticated.'
           
            ) {
            //    alert(err.message)
               if (window){
                    window.location.href = '/login'
               }
            }
        }
    }
    if (networkError) console.error(`[Network error]: ${networkError}`);
    return forward(operation);
});

const createApolloClient = () => {

    return new ApolloClient({
        // link: authLink.concat(httpLink),
        link: ApolloLink.from([errorLink, authLink, httpLink]),

        cache: new InMemoryCache()
    })
}

export default createApolloClient;