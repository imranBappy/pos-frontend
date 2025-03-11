import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';

interface Token extends JWT {
    role?: string;
}
export async function middleware(req: NextRequest) {
    console.log('middleware');
    
       

    const token: Token | null = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log('token : ', token);

 
    
    

    // const adminRoutes = ['/users', '/dashboard/product'];
    // const isAdminRoute = adminRoutes.some((route) =>
    //     req.nextUrl.pathname.startsWith(route)
    // );
    
    if (!token) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    // if (isAdminRoute && token.role !== 'ADMIN') {
    //     return NextResponse.redirect(new URL('/403', req.url)); // Redirect to a forbidden page
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [ '/dashobard'],
};
