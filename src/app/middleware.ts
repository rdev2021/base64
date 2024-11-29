import { NextResponse } from 'next/server';

export function middleware() {
    const response = NextResponse.next();

    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'strict-dynamic' 'nonce-{RANDOM_NONCE}'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "connect-src 'self'; " +
        "font-src 'self'; " +
        "img-src 'self' data:; " +
        "style-src 'self'"
    );
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
