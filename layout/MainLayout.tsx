'use client';

import { ThemeProvider } from '@/components/theme-provider';
import ApolloClientProvider from '@/lib/ApolloClientProvider';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface MainLayoutProps {
    session: Session | null;
    children: React.ReactNode;
}

export default function MainLayout({ session, children }: MainLayoutProps) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ApolloClientProvider>
                    <main>{children}</main>
                    <Toaster />
                </ApolloClientProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
