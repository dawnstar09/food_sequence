'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import NavigationButton from '@/components/NavigationButton'
import BoxManager from '@/components/BoxManager'
import GoogleLogin from '@/components/GoogleLogin'
import DevToolsBlocker from '@/components/DevToolsBlocker'

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
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

  // 로딩 중일 때
  if (isLoading || status === 'loading') {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-white text-xl">인증 확인 중...</div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // 구글 로그인되지 않은 경우 로그인 페이지 표시
  if (!session?.user) {
    return <GoogleLogin onLogin={handleLogin} />
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
