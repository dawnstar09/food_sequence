'use client'

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react'

export type BoxStatus = 'departure' | 'waiting' | 'queue' | 'finished'

export interface Box {
  id: string
  number: number
  status: BoxStatus
  lastModifiedBy?: string  // 'admin' 또는 'user'
  lastModified?: number    // 마지막 수정 시간 (타임스탬프)
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
  updateBoxAdmin: (id: string, updates: Partial<Box>) => void  // 관리자 전용 업데이트
  resetAll: () => void
  isLoading: boolean
  error: string | null
}

const BoxContext = createContext<BoxContextType | undefined>(undefined)

// 1-1부터 1-10까지의 초기 박스 데이터
const initialBoxes: Box[] = Array.from({ length: 10 }, (_, i) => ({
  id: `1-${i + 1}`,
  number: i + 1,
  status: 'waiting' as BoxStatus,
  lastModifiedBy: 'system',
  lastModified: Date.now()
}))

// 상태별 스타일 정보
const statusInfo: Record<BoxStatus, StatusInfo> = {
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
    label: '줄서기', 
    color: 'text-white', 
    bgColor: 'bg-orange-600', 
    borderColor: 'border-orange-500' 
  },
  finished: { 
    label: '완료', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-300', 
    borderColor: 'border-gray-300' 
  }
}

export function BoxProvider({ children }: { children: ReactNode }) {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // SSE 연결 설정
  useEffect(() => {
    console.log('🔌 Setting up SSE connection for real-time updates')
    
    const eventSource = new EventSource('/api/events')
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📡 SSE message received:', data)
        
        if (data.type === 'box-update' && data.box) {
          console.log('🔄 Real-time box update:', data.box)
          setBoxes(prev => prev.map(box => 
            box.id === data.box.id 
              ? { ...box, ...data.box }
              : box
          ))
        } else if (data.type === 'reset-all') {
          console.log('🔄 Real-time reset all boxes')
          setBoxes(initialBoxes.map(box => ({
            ...box,
            status: 'waiting' as BoxStatus,
            lastModified: Date.now(),
            lastModifiedBy: 'admin'
          })))
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err)
      }
    }
    
    eventSource.onopen = () => {
      console.log('✅ SSE connection established')
      setError(null)
    }
    
    eventSource.onerror = (err) => {
      console.error('❌ SSE connection error:', err)
      setError('실시간 연결에 문제가 발생했습니다.')
    }
    
    return () => {
      console.log('🔌 Closing SSE connection')
      eventSource.close()
    }
  }, [])

  const updateBox = useCallback((id: string, updates: Partial<Box>) => {
    console.log(`🔄 User updating box ${id}:`, updates)
    setBoxes(prev => prev.map(box => 
      box.id === id 
        ? { 
            ...box, 
            ...updates, 
            lastModified: Date.now(),
            lastModifiedBy: 'user'
          }
        : box
    ))
  }, [])

  const updateBoxAdmin = useCallback((id: string, updates: Partial<Box>) => {
    console.log(`🔧 Admin updating box ${id}:`, updates)
    setBoxes(prev => prev.map(box => 
      box.id === id 
        ? { 
            ...box, 
            ...updates, 
            lastModified: Date.now(),
            lastModifiedBy: 'admin'
          }
        : box
    ))
  }, [])

  const resetAll = useCallback(() => {
    console.log('🔄 Admin resetting all boxes to waiting')
    setBoxes(initialBoxes.map(box => ({
      ...box,
      status: 'waiting' as BoxStatus,
      lastModified: Date.now(),
      lastModifiedBy: 'admin'
    })))
  }, [])

  return (
    <BoxContext.Provider value={{
      boxes,
      statuses: statusInfo,
      updateBox,
      updateBoxAdmin,
      resetAll,
      isLoading,
      error
    }}>
      {children}
    </BoxContext.Provider>
  )
}

export function useBoxContext() {
  const context = useContext(BoxContext)
  if (context === undefined) {
    throw new Error('useBoxContext must be used within a BoxProvider')
  }
  return context
}
