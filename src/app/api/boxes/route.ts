import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'boxes.json')

// 초기 데이터
const initialBoxes = Array.from({ length: 10 }, (_, index) => ({
  id: `1-${index + 1}`,
  number: index + 1,
  status: 'waiting'
}))

// 데이터 파일 초기화
async function ensureDataFile() {
  const dataDir = path.join(process.cwd(), 'data')
  
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }

  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(initialBoxes, null, 2))
  }
}

// GET: 박스 데이터 조회
export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, 'utf8')
    const boxes = JSON.parse(data)
    
    return NextResponse.json({ 
      success: true, 
      boxes,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error reading boxes:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read boxes',
      boxes: initialBoxes
    }, { status: 500 })
  }
}

// POST: 박스 데이터 업데이트
export async function POST(request: NextRequest) {
  try {
    await ensureDataFile()
    const { boxes } = await request.json()
    
    if (!Array.isArray(boxes)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid data format' 
      }, { status: 400 })
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(boxes, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Boxes updated successfully',
      timestamp: Date.now()
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
    await fs.writeFile(DATA_FILE, JSON.stringify(initialBoxes, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'All boxes reset successfully',
      boxes: initialBoxes,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error resetting boxes:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset boxes' 
    }, { status: 500 })
  }
}
