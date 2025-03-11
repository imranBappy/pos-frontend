import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';

declare module 'next-auth' {
    interface User {
        role?: string;
        token?: string;
    }
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
        token?: string;
    }
}

import { loginUserFormServer } from '@/lib/login';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Missing email or password');
                    }

                    const data = await loginUserFormServer({
                        email: credentials?.email || '',
                        password: credentials?.password || '',
                    });
                

                    if (!data) throw new Error('Invalid email or password.');
                    
                    return {
                            id: data.id,
                            name: data.name,
                            email: data.email,
                            role: data?.role,
                            token: data.token,
                    };
                } catch (error) {
                    console.error('Login error:', error);
                    throw new Error(
                        (error as Error).message ||
                            'Login failed. Please try again.'
                    );
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin', // Custom sign-in page
        error: '/auth/error', // Error page
        // Redirect URL after successful login
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user?.role;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.role = token?.role as string | undefined;
            }
            session.token = token.accessToken as string;

            return session;
        },
        
        async redirect() {
            return `${baseUrl}/dashboard`;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
