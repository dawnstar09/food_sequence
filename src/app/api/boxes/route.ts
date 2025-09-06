import { NextRequest, NextResponse } from 'next/server'

// 메모리 기반 데이터 저장 (서버 재시작 시에만 초기화)
let boxesData = Array.from({ length: 10 }, (_, index) => ({
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

// POST: 박스 데이터 업데이트
export async function POST(request: NextRequest) {
  try {
    const { boxes } = await request.json()
    
    if (!Array.isArray(boxes)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid data format' 
      }, { status: 400 })
    }

    // 메모리에서 직접 업데이트
    boxesData = boxes
    lastUpdateTime = Date.now()
    
    console.log('Boxes updated at:', new Date().toISOString(), boxes)
    
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
