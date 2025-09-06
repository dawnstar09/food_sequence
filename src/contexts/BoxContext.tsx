'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type BoxStatus = 'departure' | 'waiting' | 'queue' | 'finished'

export interface Box {
  id: string
  number: number
  status: BoxStatus
}

export interface StatusInfo {
  label: string
  color: string
  bgColor: string
  borderColor: string
}

interface BoxContextType {
  boxes: Box[]
  statuses: Record<BoxStatus, StatusInfo>
  updateBox: (id: string, updates: Partial<Box>) => void
  resetAll: () => void
  isLoading: boolean
}

const BoxContext = createContext<BoxContextType | undefined>(undefined)

export const useBoxContext = () => {
  const context = useContext(BoxContext)
  if (!context) {
    throw new Error('useBoxContext must be used within a BoxProvider')
  }
  return context
}

interface BoxProviderProps {
  children: ReactNode
}

// 초기 박스 데이터
const initialBoxes: Box[] = Array.from({ length: 10 }, (_, index) => ({
  id: `1-${index + 1}`,
  number: index + 1,
  status: 'waiting' as BoxStatus
}))

export const BoxProvider = ({ children }: BoxProviderProps) => {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes)
  const [isLoading, setIsLoading] = useState(true)

  // 서버에서 데이터 가져오기
  const fetchBoxes = async () => {
    try {
      const response = await fetch('/api/boxes', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      
      if (data.success && data.boxes) {
        setBoxes(data.boxes)
      }
    } catch (error) {
      console.error('Failed to fetch boxes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 서버에 데이터 저장하기
  const saveBoxes = async (boxesToSave: Box[]) => {
    try {
      const response = await fetch('/api/boxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boxes: boxesToSave }),
      })
      
      const data = await response.json()
      if (!data.success) {
        console.error('Failed to save boxes:', data.error)
      }
    } catch (error) {
      console.error('Error saving boxes:', error)
    }
  }

  // 컴포넌트 마운트 시 서버에서 데이터 로드
  useEffect(() => {
    fetchBoxes()
  }, [])

  // 실시간 동기화 - 3초마다 서버에서 최신 데이터 가져오기
  useEffect(() => {
    if (isLoading) return

    const interval = setInterval(fetchBoxes, 3000) // 3초마다 폴링

    // 탭이 포커스될 때도 동기화
    const handleFocus = () => {
      fetchBoxes()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchBoxes()
      }
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleFocus)
    }
  }, [isLoading])

  const statuses: Record<BoxStatus, StatusInfo> = {
    departure: {
      label: '출발',
      color: 'text-green-100',
      bgColor: 'bg-green-600',
      borderColor: 'border-green-400'
    },
    waiting: {
      label: '대기',
      color: 'text-gray-100', 
      bgColor: 'bg-gray-500',
      borderColor: 'border-gray-400'
    },
    queue: {
      label: '줄 서기',
      color: 'text-orange-100',
      bgColor: 'bg-orange-600', 
      borderColor: 'border-orange-500'
    },
    finished: {
      label: '배식 끝',
      color: 'text-red-100',
      bgColor: 'bg-gray-400',
      borderColor: 'border-gray-300'
    }
  }

  const updateBox = (id: string, updates: Partial<Box>) => {
    setBoxes(prev => {
      const updatedBoxes = prev.map(box => 
        box.id === id ? { ...box, ...updates } : box
      )
      
      // 서버에 즉시 저장
      saveBoxes(updatedBoxes)
      
      console.log('Box updated:', id, updates) // 디버깅용
      return updatedBoxes
    })
  }

  const resetAll = async () => {
    try {
      const response = await fetch('/api/boxes', {
        method: 'DELETE',
      })
      
      const data = await response.json()
      if (data.success && data.boxes) {
        setBoxes(data.boxes)
        console.log('All boxes reset') // 디버깅용
      }
    } catch (error) {
      console.error('Failed to reset boxes:', error)
      // 에러 시 로컬에서라도 초기화
      setBoxes(initialBoxes)
    }
  }

  return (
    <BoxContext.Provider value={{ boxes, statuses, updateBox, resetAll, isLoading }}>
      {children}
    </BoxContext.Provider>
  )
}
