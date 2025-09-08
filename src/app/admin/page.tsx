'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import NavigationButton from '@/components/NavigationButton'
import BoxManager from '@/components/BoxManager'
import LoginSelector from '@/components/LoginSelector'
import DevToolsBlocker from '@/components/DevToolsBlocker'

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showBoxManager, setShowBoxManager] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 페이지 로드 시 세션 확인
  useEffect(() => {
    if (status === 'loading') return
    
    if (session?.user) {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }
    
    const authStatus = sessionStorage.getItem('adminAuthenticated')
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [session, status])

  const handleLogin = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem('adminAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminAuthenticated')
    if (session) {
      // Google 로그인이면 로그아웃
      window.location.href = '/api/auth/signout'
    }
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </main>
    )
  }

  // 인증되지 않은 경우 로그인 페이지 표시
  if (!isAuthenticated) {
    return <LoginSelector onLogin={handleLogin} />
  }

  // 인증된 경우 관리자 페이지 표시

  return (
    <>
      <DevToolsBlocker />
      <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            관리자 페이지
          </h1>
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
              홈으로
            </NavigationButton>
          </div>
        </div>

        <div className="flex justify-center">
          {/* 박스 관리 카드만 남김 */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">박스 관리</h3>
              <p className="text-gray-300 mb-6">1-1부터 1-10까지의 박스들을 관리합니다.</p>
              <button 
                onClick={() => setShowBoxManager(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold text-lg"
              >
                박스 설정 열기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BoxManager 모달 */}
      {showBoxManager && (
        <BoxManager onClose={() => setShowBoxManager(false)} />
      )}
    </main>
    </>
  )
}
