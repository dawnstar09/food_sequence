'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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

export const BoxProvider = ({ children }: BoxProviderProps) => {
  const [boxes, setBoxes] = useState<Box[]>(
    Array.from({ length: 10 }, (_, index) => ({
      id: `1-${index + 1}`,
      number: index + 1,
      status: 'waiting' as BoxStatus
    }))
  )

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
    setBoxes(prev => prev.map(box => 
      box.id === id ? { ...box, ...updates } : box
    ))
  }

  const resetAll = () => {
    setBoxes(prev => prev.map(box => ({ 
      ...box, 
      status: 'waiting' as BoxStatus 
    })))
  }

  return (
    <BoxContext.Provider value={{ boxes, statuses, updateBox, resetAll }}>
      {children}
    </BoxContext.Provider>
  )
}
