'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
      console.log('Fetching boxes from server...', new Date().toLocaleTimeString())
      const response = await fetch('/api/boxes?' + Date.now(), {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      
      console.log('Server response:', data)
      
      if (data.success && data.boxes) {
        setBoxes(data.boxes)
        console.log('Boxes updated from server:', data.boxes)
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
      console.log('Saving boxes to server...', boxesToSave)
      const response = await fetch('/api/boxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ boxes: boxesToSave }),
      })
      
      const data = await response.json()
      console.log('Save response:', data)
      
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

  // 실시간 동기화 - 실제 SSE 연결 구현
  useEffect(() => {
    if (isLoading) return

    console.log('🔗 Setting up real-time SSE connection...')
    
    // SSE 연결 설정
    const eventSource = new EventSource('/api/events')
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📡 SSE message received:', data)
        
        if (data.type === 'boxes-updated') {
          // 서버에서 받은 최신 데이터로 업데이트
          setBoxes(data.boxes)
          console.log('📦 Boxes updated via SSE')
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      // 연결 끊어지면 3초 후 자동 재연결
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('🔄 Attempting to reconnect SSE...')
        }
      }, 3000)
    }
    
    eventSource.onopen = () => {
      console.log('✅ SSE connection established')
    }

    // 탭이 포커스될 때만 서버와 동기화 (필요 시에만)
    const handleFocus = () => {
      console.log('📱 Tab focused, checking server state...')
      fetchBoxes()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 Tab became visible, checking server state...')
        fetchBoxes()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      console.log('🔌 Closing SSE connection and listeners...')
      eventSource.close()
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
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
      console.log('🔧 Admin resetting all boxes')
      const response = await fetch('/api/boxes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success && data.boxes) {
        // 관리자 리셋 표시 추가
        const adminResetBoxes = data.boxes.map((box: Box) => ({
          ...box,
          lastModifiedBy: 'admin',
          lastModified: Date.now()
        }))
        setBoxes(adminResetBoxes)
        console.log('🎯 All boxes reset by admin') 
      }
    } catch (error) {
      console.error('Failed to reset boxes:', error)
      // 에러 시 로컬에서라도 초기화
      const adminResetBoxes = initialBoxes.map(box => ({
        ...box,
        lastModifiedBy: 'admin',
        lastModified: Date.now()
      }))
      setBoxes(adminResetBoxes)
    }
  }

  return (
    <BoxContext.Provider value={{ boxes, statuses, updateBox, resetAll, isLoading }}>
      {children}
    </BoxContext.Provider>
  )
}
