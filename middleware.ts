import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_SIGNIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/constants/routes";

export default async function middleware(request: NextRequest) {
  try {
    const { nextUrl } = request;
    

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isPublicRoute || isApiAuthRoute) {
      return NextResponse.next();
    }

    const session = await getSession(request);

    if (isAuthRoute) {
      if (session?.user && !session.user.isOnboarded && nextUrl.pathname !== '/auth/onboarding') {
        const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
        return NextResponse.redirect(new URL(`/auth/onboarding?callbackUrl=${callbackUrl}`, nextUrl));
      }
      if (session?.user) {
        return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }

    if (!session?.user && !isPublicRoute) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

async function getSession(request: NextRequest) {
  try {
    const response = await fetch(new URL('/api/auth/session', request.url), {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|home/services|home/products|home/events|home$|api/services|api/products|api/events|api/uploadthing|auth/new-verification).*)"
  ],
};
