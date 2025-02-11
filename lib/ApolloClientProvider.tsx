"use client";

import { ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'
import createApolloClient from './apolloClient';

type PropsType = {
    children: ReactNode
}

const ApolloClientProvider = ({ children }: PropsType) => {
    const apolloClient = createApolloClient()
    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    );
};

export default ApolloClientProvider;