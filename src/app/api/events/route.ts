import { NextRequest } from 'next/server'

// 클라이언트 연결 관리
const clients = new Set<any>()

// GET: SSE 연결 설정
export async function GET(request: NextRequest) {
  // SSE 스트림 생성
  const stream = new ReadableStream({
    start(controller) {
      const writer = controller
      
      // 새 클라이언트 추가
      const clientWriter = {
        write: async (chunk: Uint8Array) => {
          try {
            controller.enqueue(chunk)
          } catch (error) {
            console.error('Error writing to client:', error)
          }
        },
        close: () => {
          try {
            controller.close()
          } catch (error) {
            console.error('Error closing client:', error)
          }
        }
      }
      
      clients.add(clientWriter as any)
      console.log(`New client connected. Total clients: ${clients.size}`)
      
      // 연결 확인 메시지
      const welcomeMessage = `data: ${JSON.stringify({ type: 'connected', message: 'SSE connected' })}\n\n`
      try {
        controller.enqueue(new TextEncoder().encode(welcomeMessage))
      } catch (error) {
        console.error('Error sending welcome message:', error)
      }
      
      // 연결 해제 시 정리
      request.signal?.addEventListener('abort', () => {
        clients.delete(clientWriter as any)
        console.log(`Client disconnected. Total clients: ${clients.size}`)
        try {
          controller.close()
        } catch (error) {
          console.error('Error closing controller:', error)
        }
      })
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

// 모든 클라이언트에게 데이터 전송하는 함수를 전역으로 내보내기
export async function broadcastToClients(data: any): Promise<void> {
  const message = `data: ${JSON.stringify(data)}\n\n`
  
  // 끊어진 연결 제거
  const deadClients = new Set<any>()
  
  console.log(`📡 Broadcasting to ${clients.size} clients:`, data)
  
  clients.forEach(async (client) => {
    try {
      await client.write(new TextEncoder().encode(message))
    } catch (error) {
      console.log('Client disconnected during broadcast')
      deadClients.add(client)
    }
  })
  
  // 끊어진 클라이언트 제거
  deadClients.forEach(client => clients.delete(client))
  
  console.log(`📡 Broadcast complete. Active clients: ${clients.size}`)
}
