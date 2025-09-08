'use client'

import { useSearchParams } from 'next/navigation'
import NavigationButton from '@/components/NavigationButton'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'OAuth 설정에 문제가 있습니다. 관리자에게 문의하세요.'
      case 'AccessDenied':
        return '접근이 거부되었습니다. 허용된 이메일로만 로그인 가능합니다.'
      case 'Verification':
        return '이메일 인증에 실패했습니다.'
      case 'Default':
        return 'redirect_uri_mismatch: Google OAuth 설정을 확인해주세요.'
      default:
        return error || '알 수 없는 오류가 발생했습니다.'
    }
  }

  const getErrorDetails = (error: string | null) => {
    if (error === 'Default') {
      return (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-sm">
          <h4 className="font-semibold mb-2">🔧 해결 방법:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Google Cloud Console 접속</li>
            <li>APIs & Services → Credentials</li>
            <li>OAuth 2.0 클라이언트 ID 선택</li>
            <li>승인된 리디렉션 URI에 추가:</li>
            <div className="bg-gray-900 p-2 rounded mt-1 font-mono text-xs">
              http://localhost:3000/api/auth/callback/google
            </div>
            <li>저장 후 다시 시도</li>
          </ol>
        </div>
      )
    }
    return null
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-400 mb-2">
            ⚠️ 인증 오류
          </h1>
          <p className="text-gray-300">
            {getErrorMessage(error)}
          </p>
        </div>

        {getErrorDetails(error)}

        <div className="mt-6 space-y-3">
          <NavigationButton
            variant="primary"
            href="/admin"
            className="w-full"
          >
            다시 로그인
          </NavigationButton>
          <NavigationButton
            variant="secondary"
            href="/"
            className="w-full"
          >
            홈으로 돌아가기
          </NavigationButton>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-gray-700 rounded text-xs text-gray-400">
            <strong>에러 코드:</strong> {error}
          </div>
        )}
      </div>
    </main>
  )
}
