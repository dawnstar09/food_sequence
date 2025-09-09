import { NextRequest, NextResponse } from 'next/server'
import { broadcastToClients } from '@/lib/sse-broadcast'

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
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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

// POST: 박스 업데이트 및 SSE 브로드캐스트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, boxId, status, lastModified, lastModifiedBy } = body
    
    console.log('📦 Box API received:', { action, boxId, status, lastModifiedBy })

    if (action === 'update' && boxId && status) {
      // 개별 박스 업데이트
      const boxIndex = boxesData.findIndex(box => box.id === boxId)
      if (boxIndex !== -1) {
        boxesData[boxIndex] = {
          ...boxesData[boxIndex],
          status,
          lastModified: lastModified || Date.now(),
          lastModifiedBy: lastModifiedBy || 'admin'
        }
        
        lastUpdateTime = Date.now()
        
        // SSE 브로드캐스트
        await broadcastToClients({
          type: 'box-update',
          box: boxesData[boxIndex]
        })
        
        console.log(`✅ Box ${boxId} updated to ${status} and broadcasted`)
        
        return NextResponse.json({ 
          success: true,
          box: boxesData[boxIndex]
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Box not found' 
        }, { status: 404 })
      }
      
    } else if (action === 'reset-all') {
      // 모든 박스 초기화
      boxesData = boxesData.map(box => ({
        ...box,
        status: 'waiting',
        lastModified: lastModified || Date.now(),
        lastModifiedBy: lastModifiedBy || 'admin'
      }))
      
      lastUpdateTime = Date.now()
      
      // SSE 브로드캐스트
      await broadcastToClients({
        type: 'reset-all',
        boxes: boxesData
      })
      
      console.log('✅ All boxes reset and broadcasted')
      
      return NextResponse.json({ 
        success: true,
        boxes: boxesData
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
      
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid action or missing parameters' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Error in box API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// OPTIONS: CORS Preflight 처리
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24시간 캐시
    }
  })
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
      const { broadcastToClients } = await import('@/lib/sse-broadcast')
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
