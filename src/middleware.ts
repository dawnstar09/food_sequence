import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 관리자 페이지 접근 시 추가 보안 헤더
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    
    // 보안 헤더 추가
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
