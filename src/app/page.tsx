'use client'

import NavigationButton from '@/components/NavigationButton'
import { useBoxContext } from '@/contexts/BoxContext'

export default function Home() {
  const { boxes, statuses } = useBoxContext()

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
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            급식 순서 현황 페이지
          </h1>
          <div className="space-x-4">
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {boxes.map((box) => (
            <div
              key={box.id}
              className={`bg-white rounded-xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 border-2 ${
                box.status === 'departure' ? 'border-green-500 shadow-green-500/50 shadow-lg' :
                box.status === 'queue' ? 'border-orange-500 shadow-orange-500/50 shadow-lg' :
                'border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-center">
                <div 
                  className={`text-3xl font-bold mb-4 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                    getStatusClasses(box.status)
                  }`}
                >
                  {box.id}
                </div>
                <div className={`text-lg font-semibold ${
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
  );
}
