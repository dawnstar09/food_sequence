'use client'

import { useState, useEffect, useCallback } from 'react'
import NavigationButton from '@/components/NavigationButton'
import DevToolsBlocker from '@/components/DevToolsBlocker'
import Image from 'next/image'

interface MealData {
  date: string
  menu: string[]
  calories: string
}

export default function MealsPage() {
  const [mealsData, setMealsData] = useState<MealData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMealsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getThisWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0=일요일, 1=월요일, ..., 6=토요일
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1) // 이번주 월요일

    const dates = []
    for (let i = 0; i < 5; i++) { // 월~금
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const loadMealsData = useCallback(async () => {
    try {
      setLoading(true)
      
      const weekDates = getThisWeekDates()
      const meals: MealData[] = []
      
      // API 키와 기본 정보
      const API_KEY = '99fa174825f445738a1daa51aa2ccefb'
      const OFFICE_CODE = 'G10' // 대전광역시교육청
      const SCHOOL_CODE = '7430048' // 대전대신고등학교
      
      // 각 날짜별로 API 호출
      for (const date of weekDates) {
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '') // YYYYMMDD 형식
        console.log(`API 호출 시도: ${dateStr}`)
        
        try {
          const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${dateStr}`
          console.log('API URL:', apiUrl)
          
          const response = await fetch(apiUrl)
          console.log(`${dateStr} API 응답:`, response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log(`${dateStr} API 데이터:`, data)
            
            if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]) {
              const mealInfo = data.mealServiceDietInfo[1].row[0]
              console.log(`${dateStr} 급식 정보:`, mealInfo)
              
              // 메뉴 파싱 (HTML 태그 및 알레르기 정보 제거)
              const menuStr = mealInfo.DDISH_NM || ''
              const menu = menuStr
                .replace(/<br\s*\/?>/gi, '|')
                .split('|')
                .map((item: string) => item.replace(/\s*\([^)]*\)/g, '').trim())
                .filter((item: string) => item.length > 0)
              
              meals.push({
                date: date.toISOString().split('T')[0],
                menu: menu,
                calories: mealInfo.CAL_INFO || '정보 없음'
              })
              console.log(`${dateStr} 메뉴 추가 완료:`, menu)
            } else {
              console.log(`${dateStr} 급식 데이터 없음`)
            }
          } else {
            console.log(`${dateStr} API 호출 실패:`, response.status)
          }
        } catch (error) {
          console.error(`${dateStr} 데이터 로드 실패:`, error)
        }
      }
      
      console.log('최종 급식 데이터:', meals)
      
      // API 데이터가 없으면 기본 데이터 사용
      if (meals.length === 0) {
        console.log('API 데이터 없음, 기본 데이터 사용')
        const defaultMeals: MealData[] = [
          {
            date: weekDates[0].toISOString().split('T')[0],
            menu: ['보리밥', '콩나물무국', '돼지고기우동국', '도토리묵무침', '총각김치', '수박'],
            calories: '1125 Kcal'
          },
          {
            date: weekDates[1].toISOString().split('T')[0],
            menu: ['수수밥', '감자찌개', '갈치조림', '콩나물무침', '배추김치', '치킨라이스'],
            calories: '1167 Kcal'
          },
          {
            date: weekDates[2].toISOString().split('T')[0],
            menu: ['귀리밥', '우무국', '제육덮밥', '동그랑땡', '마시는겔러그', '요구르트'],
            calories: '1100 Kcal'
          },
          {
            date: weekDates[3].toISOString().split('T')[0],
            menu: ['흑미밥', '파래무국', '치킨라이스', '토마토샐러드', '오이김치', '자두조림'],
            calories: '990 Kcal'
          },
          {
            date: weekDates[4].toISOString().split('T')[0],
            menu: ['차조밥', '콩나물국', '갈릭치킨', '푸실리샐러드', '깍두기', '고구마라떼'],
            calories: '1030 Kcal'
          }
        ]
        setMealsData(defaultMeals)
      } else {
        setMealsData(meals)
      }
      
    } catch (err) {
      console.error('급식 데이터 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [])  // useCallback 종료

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
  }

  if (loading) {
    return (
      <>
        <DevToolsBlocker />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">급식 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </main>
      </>
    )
  }

  return (
    <>
      <DevToolsBlocker />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🍽️ 이번주 급식 정보
            </h1>
            <p className="text-gray-600">대전대신고등학교 중식 메뉴</p>
          </div>
          <NavigationButton variant="primary" href="/">
            홈으로 돌아가기
          </NavigationButton>
        </div>

        {/* 중식 메뉴 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
          {mealsData.map((meal, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 relative ${
                isToday(meal.date) 
                  ? 'ring-4 ring-red-500' 
                  : ''
              }`}
              style={isToday(meal.date) ? {
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4)',
              } : {}}
            >
              {/* TODAY 배지 */}
              {isToday(meal.date) && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    TODAY
                  </span>
                </div>
              )}
              
              {/* 카드 헤더 */}
              <div className={`text-white p-4 relative ${
                isToday(meal.date) 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}>
                <div className="text-center">
                  <h3 className={`text-lg font-semibold ${
                    isToday(meal.date) ? 'text-yellow-200' : ''
                  }`}>
                    {new Date(meal.date).toLocaleDateString('ko-KR', { 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                    {isToday(meal.date) && (
                      <span className="ml-2 text-yellow-300 animate-bounce">⭐</span>
                    )}
                  </h3>
                  <span className="text-sm opacity-90">중식</span>
                </div>
              </div>

              {/* 카드 본문 */}
              <div className="p-4">
                {/* 메뉴 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">🍚</span>
                    메뉴
                  </h4>
                  <ul className="space-y-1">
                    {meal.menu.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 pl-4 relative">
                        <span className="absolute left-0 text-blue-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 칼로리 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <span className="mr-2">⚡</span>
                    칼로리
                  </h4>
                  <p className="text-orange-600 font-medium text-sm">{meal.calories}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 석식 안내 */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌙 석식 정보</h2>
          <div className="flex justify-center mb-4">
            <Image 
              src="/suksik.png" 
              alt="석식 메뉴" 
              width={600} 
              height={400}
              className="rounded-lg shadow-md"
              priority
            />
          </div>
          <p className="text-gray-600">석식 메뉴는 위 이미지를 참고해주세요</p>
        </div>
      </div>
    </main>
    </>
  )
}
