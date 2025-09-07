import { NextRequest, NextResponse } from 'next/server'

// Box 타입 정의
interface Box {
  id: string
  number: number
  status: string
  lastModifiedBy?: string
  lastModified?: number
}

// 메모리 기반 데이터 저장 (서버 재시작 시에만 초기화)
let boxesData: Box[] = Array.from({ length: 10 }, (_, index) => ({
  id: `1-${index + 1}`,
  number: index + 1,
  status: 'waiting'
}))

let lastUpdateTime = Date.now()

// GET: 박스 데이터 조회
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      boxes: boxesData,
      timestamp: lastUpdateTime,
      server_time: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error reading boxes:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read boxes',
      boxes: boxesData
    }, { status: 500 })
  }
}

// POST: 박스 데이터 업데이트 (관리자 우선 로직 적용)
export async function POST(request: NextRequest) {
  try {
    const { boxes } = await request.json()
    
    if (!Array.isArray(boxes)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid data format' 
      }, { status: 400 })
    }

    // 관리자 변경사항 우선 적용 로직
    const updatedBoxes = boxes.map(newBox => {
      const currentBox = boxesData.find(b => b.id === newBox.id)
      
      // 관리자가 변경한 경우, 항상 적용
      if (newBox.lastModifiedBy === 'admin') {
        console.log(`🔧 Admin override: ${newBox.id} -> ${newBox.status}`)
        return newBox
      }
      
      // 기존 데이터가 관리자가 변경한 것이면 유지 (최근 5분 이내)
      if (currentBox?.lastModifiedBy === 'admin' && 
          currentBox.lastModified && 
          (Date.now() - currentBox.lastModified) < 5 * 60 * 1000) { // 5분
        console.log(`🛡️ Protecting admin change: ${currentBox.id} stays ${currentBox.status}`)
        return currentBox
      }
      
      // 일반 사용자 변경사항 적용
      return newBox
    })

    // 메모리에서 직접 업데이트
    boxesData = updatedBoxes
    lastUpdateTime = Date.now()
    
    // SSE로 모든 클라이언트에게 실시간 업데이트 전송
    try {
      const { broadcastToClients } = await import('../events/route')
      await broadcastToClients({
        type: 'boxes-updated',
        boxes: boxesData,
        timestamp: lastUpdateTime
      })
      console.log('📡 SSE broadcast sent successfully')
    } catch (error) {
      console.error('❌ Failed to broadcast SSE update:', error)
    }
    
    console.log('Boxes updated at:', new Date().toISOString(), updatedBoxes)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Boxes updated successfully',
      timestamp: lastUpdateTime
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error updating boxes:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update boxes' 
    }, { status: 500 })
  }
}

// DELETE: 모든 박스 초기화
export async function DELETE() {
  try {
    const initialBoxes = Array.from({ length: 10 }, (_, index) => ({
      id: `1-${index + 1}`,
      number: index + 1,
      status: 'waiting'
    }))
    
    boxesData = initialBoxes
    lastUpdateTime = Date.now()
    
    // SSE로 모든 클라이언트에게 리셋 알림
    try {
      const { broadcastToClients } = await import('../events/route')
      await broadcastToClients({
        type: 'boxes-updated',
        boxes: boxesData,
        timestamp: lastUpdateTime
      })
      console.log('📡 SSE reset broadcast sent successfully')
    } catch (error) {
      console.error('❌ Failed to broadcast SSE reset:', error)
    }
    
    console.log('All boxes reset at:', new Date().toISOString())
    
    return NextResponse.json({ 
      success: true, 
      message: 'All boxes reset successfully',
      boxes: boxesData,
      timestamp: lastUpdateTime
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error resetting boxes:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset boxes' 
    }, { status: 500 })
  }
}
