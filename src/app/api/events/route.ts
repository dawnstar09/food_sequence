import { NextRequest } from 'next/server'
import { addClient, removeClient } from '@/lib/sse-broadcast'
// 에러 issue 실습 브런치
// GET: SSE 연결 설정
export async function GET(request: NextRequest) {
  // SSE 스트림 생성
  const stream = new ReadableStream({
    start(controller) {
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
      
      addClient(clientWriter)
      
      // 연결 확인 메시지
      const welcomeMessage = `data: ${JSON.stringify({ type: 'connected', message: 'SSE connected' })}\n\n`
      try {
        controller.enqueue(new TextEncoder().encode(welcomeMessage))
      } catch (error) {
        console.error('Error sending welcome message:', error)
      }
      
      // 연결 해제 시 정리
      request.signal?.addEventListener('abort', () => {
        removeClient(clientWriter)
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
