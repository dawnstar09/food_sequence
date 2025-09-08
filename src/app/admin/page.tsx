'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import NavigationButton from '@/components/NavigationButton'
import BoxManager from '@/components/BoxManager'
import GoogleLogin from '@/components/GoogleLogin'
import DevToolsBlocker from '@/components/DevToolsBlocker'
import { useBoxContext } from '@/contexts/BoxContext'

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { error, isLoading: contextLoading } = useBoxContext()
  const [showBoxManager, setShowBoxManager] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 구글 세션 확인
  useEffect(() => {
    if (status === 'loading') return
    setIsLoading(false)
  }, [status])

  const handleLogin = () => {
    // 구글 로그인 성공 시 자동으로 세션이 활성화됨
    console.log('Google login successful')
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  // 로딩 중
  if (isLoading || status === 'loading') {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">로딩 중...</div>
        </main>
      </>
    )
  }

  // 인증되지 않은 경우 로그인 페이지 표시
  if (!session || !session.user) {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg">
            <GoogleLogin onLogin={handleLogin} />
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
              <p className="mb-1">환영합니다, <span className="text-blue-400 font-semibold">{session.user.name}</span>님</p>
              <p className="text-sm text-gray-400">{session.user.email}</p>
            </div>
          </div>
          <div className="space-x-4">
            <NavigationButton
              variant="danger"
              onClick={handleLogout}
            >
              로그아웃
            </NavigationButton>
            <NavigationButton
              variant="primary"
              href="/"
            >
              홈으로 돌아가기
            </NavigationButton>
          </div>
        </div>

        {/* 관리자 시스템 상태 */}
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
               박스 상태 관리
            </button>
          </div>
        </div>

        {/* BoxManager Modal */}
        {showBoxManager && (
          <BoxManager onClose={() => setShowBoxManager(false)} />
        )}

        <div className="text-gray-500 text-sm text-center">
          대전대신고등학교 급식 순서 관리 시스템 v1.0 - Firebase Edition
        </div>
      </div>
      </main>
    </>
  )
}
