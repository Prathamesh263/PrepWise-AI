import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Get auth token from cookies (simpler approach for Edge Runtime)
    const authToken = request.cookies.get('session')?.value;
    const isAuth = !!authToken;

    // Protected routes (require login)
    const protectedRoutes = ['/', '/dashboard'];
    const authRoutes = ['/sign-in', '/sign-up'];

    // 1. If authenticated user tries to access auth routes → Redirect to home
    if (isAuth && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If unauthenticated user tries to access protected routes → Redirect to sign-in
    if (!isAuth && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 