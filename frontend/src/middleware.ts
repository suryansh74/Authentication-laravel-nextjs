import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('✅ Middleware is running on:', request.nextUrl.pathname)

  const token = request.cookies.get('token')?.value

  // Debug: log token value
  console.log('🔐 Token from cookie:', token)

  // Redirect if user is already logged in and trying to access sign-in/up
  if (token && ['/sign-in', '/sign-up'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && ['/dashboard'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Add custom header for frontend verification (debug only)
  const response = NextResponse.next()
  response.headers.set('x-middleware-status', 'ran')
  return response
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/dashboard'],
}
