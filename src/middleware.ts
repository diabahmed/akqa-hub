import type { NextRequest } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

import i18nConfig from '@src/i18n/config';

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|static|_next/static|.*\\..*|_next/image|_next|favicon.ico).*)',
  ],
};
