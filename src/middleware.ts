import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Block search engine indexing with HTTP headers
  const response = NextResponse.next()

  // Add no-index headers
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache')

  // Block common crawlers
  const userAgent = request.headers.get('user-agent') || ''
  const crawlerPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot'
  ]

  if (crawlerPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
    return new NextResponse('Access denied for crawlers', {
      status: 403,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache'
      }
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}