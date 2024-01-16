// docs voor duidelijkheid: https://stackoverflow.com/a/74078101
export { default } from 'next-auth/middleware'
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith('/api/') || path.startsWith('/_next/') || 
      path.startsWith('/static/') || path === '/favicon.ico' || 
      path.startsWith('/auth/') || path === '/login' || path === '/quote' || path === '/') {
    return NextResponse.next();
  }

  const session = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });

  if (!session && path !== '/login') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (path.startsWith('/admin') && (!session || !session.isAdmin)) {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|favicon.ico|login).*)']
}
