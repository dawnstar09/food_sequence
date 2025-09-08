'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [authUrl, setAuthUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.origin)
    setAuthUrl(`${window.location.origin}/api/auth`)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Authentication Debug Info</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">현재 도메인</h2>
            <div className="bg-gray-900 p-3 rounded font-mono text-sm text-white">
              {currentUrl}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">JWT Auth API Endpoint</h2>
            <div className="bg-gray-900 p-3 rounded font-mono text-sm text-white">
              {authUrl}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">보안 인증 시스템</h2>
            <div className="bg-gray-900 p-4 rounded text-sm text-gray-300">
              <p className="mb-4">현재 JWT 기반 서버 사이드 인증을 사용합니다:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>🔒 서버 사이드 패스워드 검증</li>
                <li>🍪 HttpOnly 쿠키 기반 세션 관리</li>
                <li>🛡️ 클라이언트 사이드 노출 방지</li>
                <li>🔑 JWT 토큰 기반 인증</li>
                <li>⚡ 세션 조작 방지</li>
              </ul>
            </div>
          </div>

          <div className="pt-4">
            <a 
              href="/admin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              관리자 페이지로 이동
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
