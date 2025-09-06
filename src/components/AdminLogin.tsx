'use client'

import { useState, useEffect } from 'react'
import NavigationButton from '@/components/NavigationButton'

interface AdminLoginProps {
  onLogin: () => void
}

interface FailedAttempt {
  count: number
  blockedUntil?: number
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null)
  const [failedCount, setFailedCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('')

  const MAX_ATTEMPTS = 5
  const BLOCK_DURATION = 24 * 60 * 60 * 1000 // 24시간 (밀리초)

  useEffect(() => {
    checkBlockStatus()
    
    // 1분마다 차단 상태 확인
    const interval = setInterval(() => {
      checkBlockStatus()
      if (blockedUntil) {
        const remaining = formatTimeRemaining()
        setTimeRemaining(remaining)
        
        // 시간이 다 되면 자동으로 차단 해제
        if (!remaining) {
          setIsBlocked(false)
          setBlockedUntil(null)
          clearFailedAttempts()
        }
      }
    }, 60000) // 1분마다

    return () => clearInterval(interval)
  }, [blockedUntil])

  const checkBlockStatus = () => {
    const storedData = localStorage.getItem('adminFailedAttempts')
    if (storedData) {
      try {
        const data: FailedAttempt = JSON.parse(storedData)
        const now = Date.now()
        
        if (data.blockedUntil && now < data.blockedUntil) {
          // 아직 차단 시간이 남아있음
          setIsBlocked(true)
          setBlockedUntil(new Date(data.blockedUntil))
          setFailedCount(data.count)
        } else if (data.blockedUntil && now >= data.blockedUntil) {
          // 차단 시간이 끝남 - 데이터 초기화
          localStorage.removeItem('adminFailedAttempts')
          setIsBlocked(false)
          setFailedCount(0)
        } else {
          // 차단되지 않았지만 실패 횟수가 있음
          setFailedCount(data.count)
        }
      } catch (e) {
        // 데이터가 손상된 경우 초기화
        localStorage.removeItem('adminFailedAttempts')
      }
    }
  }

  const updateFailedAttempts = (count: number) => {
    const now = Date.now()
    const data: FailedAttempt = {
      count,
      blockedUntil: count >= MAX_ATTEMPTS ? now + BLOCK_DURATION : undefined
    }
    
    localStorage.setItem('adminFailedAttempts', JSON.stringify(data))
    
    if (count >= MAX_ATTEMPTS) {
      setIsBlocked(true)
      setBlockedUntil(new Date(now + BLOCK_DURATION))
    }
    setFailedCount(count)
  }

  const clearFailedAttempts = () => {
    localStorage.removeItem('adminFailedAttempts')
    setFailedCount(0)
    setIsBlocked(false)
    setBlockedUntil(null)
    setTimeRemaining('')
  }

  // 개발용 리셋 함수 (Ctrl + Shift + R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        if (confirm('개발자 모드: 차단 상태를 초기화하시겠습니까?')) {
          clearFailedAttempts()
          alert('차단 상태가 초기화되었습니다.')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      setError('접근이 차단되었습니다. 나중에 다시 시도해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    // 짧은 로딩 효과를 위한 지연
    setTimeout(() => {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      
      if (password === adminPassword) {
        // 로그인 성공 - 실패 기록 초기화
        clearFailedAttempts()
        onLogin()
        setError('')
      } else {
        // 로그인 실패
        const newCount = failedCount + 1
        updateFailedAttempts(newCount)
        
        if (newCount >= MAX_ATTEMPTS) {
          setError('비밀번호를 5회 이상 잘못 입력하여 24시간 동안 접근이 차단되었습니다.')
        } else {
          const remaining = MAX_ATTEMPTS - newCount
          setError(`비밀번호가 올바르지 않습니다. (${remaining}회 남음)`)
        }
        setPassword('')
      }
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  const formatTimeRemaining = () => {
    if (!blockedUntil) return ''
    
    const now = new Date()
    const diff = blockedUntil.getTime() - now.getTime()
    
    if (diff <= 0) return ''
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    } else {
      return `${minutes}분`
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">관리자 로그인</h1>
          <p className="text-gray-300">관리자 페이지에 접근하려면 비밀번호를 입력하세요</p>
          
          {failedCount > 0 && !isBlocked && (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
              <p className="text-yellow-300 text-sm">
                실패 횟수: {failedCount}/{MAX_ATTEMPTS}
              </p>
            </div>
          )}
        </div>

        {isBlocked ? (
          // 차단된 상태
          <div className="space-y-6">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <div className="text-center">
                <div className="text-red-400 text-6xl mb-4">🚫</div>
                <h3 className="text-xl font-bold text-red-300 mb-2">접근 차단</h3>
                <p className="text-red-300 text-sm mb-4">
                  비밀번호를 5회 이상 잘못 입력하여 접근이 차단되었습니다.
                </p>
                <p className="text-red-400 font-semibold">
                  남은 시간: {timeRemaining || formatTimeRemaining()}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <NavigationButton
                variant="secondary"
                href="/"
                className="w-full"
              >
                홈으로 돌아가기
              </NavigationButton>
            </div>
          </div>
        ) : (
          // 로그인 폼
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || !password.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    isLoading || !password.trim()
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      확인 중...
                    </div>
                  ) : (
                    '로그인'
                  )}
                </button>

                <div className="text-center">
                  <NavigationButton
                    variant="secondary"
                    href="/"
                    className="w-full"
                  >
                    홈으로 돌아가기
                  </NavigationButton>
                </div>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                관리자 권한이 필요한 페이지입니다
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
