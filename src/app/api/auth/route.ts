import { NextResponse } from 'next/server'
import crypto from 'crypto'

// 환경변수 가져오기 함수
function getEnvVars() {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  const JWT_SECRET = process.env.JWT_SECRET

  if (!ADMIN_PASSWORD || !JWT_SECRET) {
    throw new Error('환경변수 ADMIN_PASSWORD와 JWT_SECRET이 설정되지 않았습니다')
  }

  return { ADMIN_PASSWORD, JWT_SECRET }
}

// 간단한 JWT 토큰 생성
function generateToken(payload: any) {
  const { JWT_SECRET } = getEnvVars()
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  
  return `${header}.${body}.${signature}`
}

// JWT 토큰 검증
function verifyToken(token: string) {
  try {
    const { JWT_SECRET } = getEnvVars()
    const [header, payload, signature] = token.split('.')
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url')
    
    if (signature !== expectedSignature) {
      return null
    }
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    
    // 토큰 만료 확인 (1시간)
    if (Date.now() > decoded.exp) {
      return null
    }
    
    return decoded
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const { ADMIN_PASSWORD } = getEnvVars()
    
    console.log('🔐 Admin login attempt')
    
    // 서버 사이드에서 패스워드 검증
    if (password === ADMIN_PASSWORD) {
      // 1시간 유효한 토큰 생성
      const token = generateToken({
        role: 'admin',
        exp: Date.now() + (60 * 60 * 1000), // 1시간
        iat: Date.now()
      })
      
      console.log('✅ Admin authentication successful')
      
      // HttpOnly 쿠키로 토큰 설정
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 // 1시간
      })
      
      return response
    } else {
      console.log('❌ Admin authentication failed')
      return NextResponse.json(
        { success: false, error: '패스워드가 올바르지 않습니다.' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('admin-token=')[1]?.split(';')[0]
    
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }
    
    const decoded = verifyToken(token)
    
    if (decoded && decoded.role === 'admin') {
      return NextResponse.json({ authenticated: true })
    } else {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  // 로그아웃 - 쿠키 삭제
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-token')
  return response
}
