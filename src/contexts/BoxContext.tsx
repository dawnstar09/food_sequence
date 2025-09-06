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

  // 컴포넌트 마운트 시 localStorage에서 데이터 로드
  useEffect(() => {
    const savedBoxes = localStorage.getItem('food-sequence-boxes')
    if (savedBoxes) {
      try {
        const parsedBoxes = JSON.parse(savedBoxes)
        setBoxes(parsedBoxes)
      } catch (error) {
        console.error('Failed to parse saved boxes:', error)
        // 파싱 실패 시 초기 데이터 사용
        localStorage.setItem('food-sequence-boxes', JSON.stringify(initialBoxes))
      }
    } else {
      // 저장된 데이터가 없으면 초기 데이터 저장
      localStorage.setItem('food-sequence-boxes', JSON.stringify(initialBoxes))
    }
  }, [])

  // 다른 탭/창에서의 변경사항 실시간 동기화
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'food-sequence-boxes' && e.newValue) {
        try {
          const updatedBoxes = JSON.parse(e.newValue)
          setBoxes(updatedBoxes)
        } catch (error) {
          console.error('Failed to sync boxes from storage:', error)
        }
      }
    }

    // 사용자 정의 이벤트로 같은 탭에서의 변경사항도 감지
    const handleCustomSync = (e: CustomEvent) => {
      if (e.detail && e.detail.boxes) {
        setBoxes(e.detail.boxes)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('boxes-updated' as any, handleCustomSync)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('boxes-updated' as any, handleCustomSync)
    }
  }, [])

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
      
      // localStorage에 저장
      localStorage.setItem('food-sequence-boxes', JSON.stringify(updatedBoxes))
      
      // 같은 탭의 다른 컴포넌트들에게 업데이트 알림
      window.dispatchEvent(new CustomEvent('boxes-updated', {
        detail: { boxes: updatedBoxes }
      }))
      
      return updatedBoxes
    })
  }

  const resetAll = () => {
    const resetBoxes = initialBoxes.map(box => ({ ...box }))
    setBoxes(resetBoxes)
    
    // localStorage에 저장
    localStorage.setItem('food-sequence-boxes', JSON.stringify(resetBoxes))
    
    // 같은 탭의 다른 컴포넌트들에게 업데이트 알림
    window.dispatchEvent(new CustomEvent('boxes-updated', {
      detail: { boxes: resetBoxes }
    }))
  }

  return (
    <BoxContext.Provider value={{ boxes, statuses, updateBox, resetAll }}>
      {children}
    </BoxContext.Provider>
  )
}
