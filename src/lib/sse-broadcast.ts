// SSE 브로드캐스트 유틸리티
const clients = new Set<any>()

// 클라이언트 연결 추가
export function addClient(client: any) {
  clients.add(client)
  console.log(`New client connected. Total clients: ${clients.size}`)
}

// 클라이언트 연결 제거
export function removeClient(client: any) {
  clients.delete(client)
  console.log(`Client disconnected. Total clients: ${clients.size}`)
}

// 모든 클라이언트에게 데이터 전송
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

export function getClientCount(): number {
  return clients.size
}
