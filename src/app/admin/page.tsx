'use client'

import { useState } from 'react'
import NavigationButton from '@/components/NavigationButton'
import BoxManager from '@/components/BoxManager'
import DevToolsBlocker from '@/components/DevToolsBlocker'
import { useBoxContext } from '@/contexts/BoxContext'

export default function AdminPage() {
  const { error } = useBoxContext()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showBoxManager, setShowBoxManager] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      setAuthError('')
      console.log('✅ 관리자 인증 성공')
    } else {
      setAuthError('패스워드가 올바르지 않습니다.')
      console.log('❌ 관리자 인증 실패')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    setShowBoxManager(false)
    console.log('👋 관리자 로그아웃')
  }

  // 인증되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                🔐 관리자 로그인
              </h1>
              <p className="text-gray-400">
                급식 순서 관리 시스템
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  관리자 패스워드
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="패스워드를 입력하세요"
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded-lg text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                로그인
              </button>
            </form>

            <div className="mt-6 text-center">
              <NavigationButton
                variant="secondary"
                href="/"
              >
                홈으로 돌아가기
              </NavigationButton>
            </div>
          </div>
        </main>
      </>
    )
  }

  // 인증된 경우 관리자 페이지 표시
  return (
    <>
      <DevToolsBlocker />
      <main className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                관리자 페이지
              </h1>
              <div className="text-gray-300">
                <p className="mb-1">환영합니다, <span className="text-blue-400 font-semibold">관리자</span>님</p>
                <p className="text-sm text-gray-400">급식 순서 관리 시스템</p>
              </div>
            </div>
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                로그아웃
              </button>
              <NavigationButton
                variant="primary"
                href="/"
              >
                홈으로 돌아가기
              </NavigationButton>
            </div>
          </div>

          {/* 시스템 오류 표시 */}
          {error && (
            <div className="mb-6 bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <strong>시스템 오류:</strong> {error}
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">빠른 작업</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowBoxManager(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                📦 박스 상태 관리
              </button>
            </div>
          </div>

          {/* BoxManager Modal */}
          {showBoxManager && (
            <BoxManager onClose={() => setShowBoxManager(false)} />
          )}

          <div className="text-gray-500 text-sm text-center">
            대전대신고등학교 급식 순서 관리 시스템 v1.0 - Simple Edition
          </div>
        </div>
      </main>
    </>
  )
}
