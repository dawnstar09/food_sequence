'use client'

import NavigationButton from '@/components/NavigationButton'

export default function MealsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🍽️ 급식 정보
            </h1>
            <p className="text-gray-600">대전대신고등학교 이번 주 급식 메뉴</p>
          </div>
          <NavigationButton variant="primary" href="/">
            홈으로 돌아가기
          </NavigationButton>
        </div>

        {/* 임시 메시지(어차피 api 잘 작동해서 상관은 없음)*/}
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">급식 정보 준비 중</h3>
          <p className="text-gray-500">곧 실제 급식 데이터가 표시됩니다.</p>
        </div>
      </div>
    </main>
  )
}
