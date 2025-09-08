'use client'

import NavigationButton from '@/components/NavigationButton'
import { useBoxContext } from '@/contexts/BoxContext'
import DevToolsBlocker from '@/components/DevToolsBlocker'

export default function Home() {
  const { boxes, statuses, error } = useBoxContext()

  const getStatusClasses = (status: 'departure' | 'waiting' | 'queue' | 'finished') => {
    switch (status) {
      case 'departure':
        return 'bg-green-600 border-green-400 text-green-100'
      case 'waiting':
        return 'bg-gray-500 border-gray-400 text-gray-100'
      case 'queue':
        return 'bg-orange-600 border-orange-500 text-white'
      case 'finished':
        return 'bg-gray-300 border-gray-300 text-gray-600 opacity-70'
      default:
        return 'bg-gray-500 border-gray-400 text-gray-100'
    }
  }

  return (
    <>
      <DevToolsBlocker />
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            급식 순서 현황 페이지
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <NavigationButton
              variant="primary"
              href="/meals"
            >
              🍽️ 급식 정보
            </NavigationButton>
            <NavigationButton
              variant="secondary"
              href="/admin"
            >
              관리자 페이지 →
            </NavigationButton>
          </div>
        </div>
        
        {/* 시스템 오류 표시 */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <strong>시스템 오류:</strong> {error}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {boxes.map((box) => (
            <div
              key={box.id}
              className={`bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all duration-300 border-2 ${
                box.status === 'departure' ? 'border-green-500 shadow-green-500/50 shadow-lg' :
                box.status === 'queue' ? 'border-orange-500 shadow-orange-500/50 shadow-lg' :
                'border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-center">
                <div 
                  className={`text-base sm:text-lg md:text-xl font-bold mb-2 px-2 py-1 rounded-lg border-2 transition-all duration-200 ${
                    getStatusClasses(box.status)
                  }`}
                >
                  {box.id}
                </div>
                <div className={`text-xs sm:text-sm md:text-base font-semibold ${
                  box.status === 'departure' ? 'text-green-700' :
                  box.status === 'waiting' ? 'text-gray-700' :
                  box.status === 'queue' ? 'text-orange-700' :
                  box.status === 'finished' ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {statuses[box.status].label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 색상별 설명 */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📋 상태별 색상 안내</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg border-2 border-green-400"></div>
              <div>
                <div className="font-semibold text-green-700">출발</div>
                <div className="text-sm text-gray-500">급식실로 이동</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-lg border-2 border-gray-400"></div>
              <div>
                <div className="font-semibold text-gray-700">대기</div>
                <div className="text-sm text-gray-500">교실에서 대기</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg border-2 border-orange-500"></div>
              <div>
                <div className="font-semibold text-orange-700">줄 서기</div>
                <div className="text-sm text-gray-500">교실 앞 대기</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-lg border-2 border-gray-300 opacity-70"></div>
              <div>
                <div className="font-semibold text-red-600">배식 끝</div>
                <div className="text-sm text-gray-500">급식 완료</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
