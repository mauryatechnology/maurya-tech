import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET is missing or too short. Set a random secret of at least 32 characters (openssl rand -base64 48) in your environment.'
  );
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

const SUPPORTED_COUNTRIES = ['in', 'us', 'uk'];

function detectCountry(request) {
  // 1. Explicit user cookie preference
  const cookieCountry = request.cookies.get('preferred_country')?.value?.toLowerCase();
  if (cookieCountry && SUPPORTED_COUNTRIES.includes(cookieCountry)) {
    return cookieCountry;
  }

  // 2. Vercel / Cloudflare geo header
  const geoCountry = (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    ''
  ).toLowerCase();

  if (geoCountry === 'us') return 'us';
  if (geoCountry === 'gb' || geoCountry === 'uk') return 'uk';
  if (geoCountry === 'in') return 'in';

  // 3. Accept-Language header hint
  const acceptLang = request.headers.get('accept-language')?.toLowerCase() || '';
  if (acceptLang.includes('en-us')) return 'us';
  if (acceptLang.includes('en-gb')) return 'uk';

  // 4. Default launch market
  return 'in';
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Enterprise Anti-CSRF & Origin Verification on API Mutations (Excluding server-to-server webhooks)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/webhooks/')) {
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    if (isMutation) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      const secFetchSite = request.headers.get('sec-fetch-site');

      // Reject cross-site mutation requests (CSRF Defense)
      if (secFetchSite && secFetchSite === 'cross-site') {
        return NextResponse.json(
          { success: false, message: 'Cross-origin API mutation blocked by security policy.' },
          { status: 403 }
        );
      }

      // Check matching origin if provided
      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost !== host) {
            return NextResponse.json(
              { success: false, message: 'Untrusted origin request blocked.' },
              { status: 403 }
            );
          }
        } catch (e) {
          // Invalid origin header
          return NextResponse.json(
            { success: false, message: 'Invalid origin header.' },
            { status: 400 }
          );
        }
      }
    }
  }

  // 2. Protect /admin routes, excluding /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, secretKey);
    } catch (err) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Redirect /admin/login to /admin if already authenticated
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, secretKey);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (err) {
        // Token invalid, let proceed to login
      }
    }
  }

  // 4. Country & Locale Negotiation (Non-Redirecting, SEO-Friendly)
  const detectedCountry = detectCountry(request);
  const response = NextResponse.next();
  response.headers.set('x-user-country', detectedCountry);

  if (!request.cookies.get('preferred_country')) {
    response.cookies.set('preferred_country', detectedCountry, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year persistence
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)'],
};
