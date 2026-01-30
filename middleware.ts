import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasSession =
    request.cookies.get('accessToken') ||
    request.cookies.get('si')

  const isDashboard =
    request.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !hasSession) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
