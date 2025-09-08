'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import DevToolsBlocker from '@/components/DevToolsBlocker'

interface GoogleLoginProps {
  onLogin: () => void
}

export default function GoogleLogin({ onLogin }: GoogleLoginProps) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user) {
      onLogin()
    }
  }, [session, onLogin])

  const handleGoogleLogin = () => {
    signIn('google', { 
      callbackUrl: '/admin'
    })
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">로그인 확인 중...</h3>
              <p className="text-gray-400">구글 인증을 처리하고 있습니다</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (session) {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">로그인 성공!</h3>
              <p className="text-gray-300 mb-2">환영합니다, {session.user?.name}님</p>
              <p className="text-gray-400 text-sm mb-6">{session.user?.email}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  관리자 페이지로 이동
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DevToolsBlocker />
      <main className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">관리자 로그인</h2>
            <p className="text-gray-400">승인된 구글 계정으로만 접근 가능합니다</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 border border-gray-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google 계정으로 로그인
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              🔒 보안이 강화된 관리자 전용 로그인
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              ← 홈으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
