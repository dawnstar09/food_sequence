'use client'

import { useState } from 'react'
import GoogleLogin from '@/components/GoogleLogin'
import AdminLogin from '@/components/AdminLogin'
import DevToolsBlocker from '@/components/DevToolsBlocker'

interface LoginSelectorProps {
  onLogin: () => void
}

export default function LoginSelector({ onLogin }: LoginSelectorProps) {
  const [loginMethod, setLoginMethod] = useState<'select' | 'google' | 'password'>('select')

  if (loginMethod === 'google') {
    return <GoogleLogin onLogin={onLogin} />
  }

  if (loginMethod === 'password') {
    return <AdminLogin onLogin={onLogin} />
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
            <p className="text-gray-400">로그인 방법을 선택하세요</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setLoginMethod('google')}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 border border-gray-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div className="text-left">
                <div className="font-semibold">Google로 로그인</div>
                <div className="text-sm text-gray-600">안전하고 빠른 로그인</div>
              </div>
            </button>

            <button
              onClick={() => setLoginMethod('password')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              <div className="text-left">
                <div className="font-semibold">비밀번호로 로그인</div>
                <div className="text-sm text-gray-400">기존 관리자 비밀번호</div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              ← 홈으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
