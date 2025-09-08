'use client'

import { useState, useEffect } from 'react'
import NavigationButton from '@/components/NavigationButton'
import BoxManager from '@/components/BoxManager'
import DevToolsBlocker from '@/components/DevToolsBlocker'
import { useBoxContext } from '@/contexts/BoxContext'

export default function AdminPage() {
  const { error } = useBoxContext()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [showBoxManager, setShowBoxManager] = useState(false)
  const [authError, setAuthError] = useState('')

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include'
      })
      const data = await response.json()
      
      setIsAuthenticated(data.authenticated || false)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsAuthenticated(true)
        setPassword('')
        console.log('✅ 관리자 인증 성공 (서버 검증)')
      } else {
        setAuthError(data.error || '인증에 실패했습니다.')
        console.log('❌ 관리자 인증 실패 (서버 검증)')
      }
    } catch (error) {
      setAuthError('서버 연결 오류가 발생했습니다.')
      console.error('Login error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
      
      setIsAuthenticated(false)
      setPassword('')
      setShowBoxManager(false)
      console.log('👋 관리자 로그아웃 (서버 처리)')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">인증 확인 중...</div>
        </main>
      </>
    )
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
                🔒 보안 관리자 로그인
              </h1>
              <p className="text-gray-400">
                급식 순서 관리 시스템
              </p>
              <p className="text-xs text-gray-500 mt-2">
                서버 사이드 인증 보안 적용
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
                  autoComplete="current-password"
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

            <div className="mt-4 text-xs text-gray-500 text-center">
              🔐 JWT 토큰 기반 보안 인증<br/>
              🍪 HttpOnly 쿠키 세션 관리
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
                🔒 보안 관리자 페이지
              </h1>
              <div className="text-gray-300">
                <p className="mb-1">환영합니다, <span className="text-green-400 font-semibold">인증된 관리자</span>님</p>
                <p className="text-sm text-gray-400">급식 순서 관리 시스템</p>
                <p className="text-xs text-green-500">✅ 서버 사이드 JWT 인증 완료</p>
              </div>
            </div>
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                안전 로그아웃
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
            <h2 className="text-xl font-bold text-white mb-4">🛡️ 보안 강화된 관리 도구</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowBoxManager(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                📦 박스 상태 관리
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-green-400">✅</span> 서버 사이드 인증
                </div>
                <div>
                  <span className="text-green-400">✅</span> JWT 토큰 보안
                </div>
                <div>
                  <span className="text-green-400">✅</span> HttpOnly 쿠키
                </div>
                <div>
                  <span className="text-green-400">✅</span> 클라이언트 조작 방지
                </div>
              </div>
            </div>
          </div>

          {/* BoxManager Modal */}
          {showBoxManager && (
            <BoxManager onClose={() => setShowBoxManager(false)} />
          )}

          <div className="text-gray-500 text-sm text-center">
            대전대신고등학교 급식 순서 관리 시스템 v2.0 - Secure Edition<br/>
            🔐 JWT + HttpOnly Cookie 보안 적용
          </div>
        </div>
      </main>
    </>
  )
}
