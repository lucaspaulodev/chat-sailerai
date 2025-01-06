const API_BASE_URL = 'http://localhost:8000'

export async function fetchChats() {
  const response = await fetch(`${API_BASE_URL}/chats`)
  if (!response.ok) {
    throw new Error('Failed to fetch chats')
  }
  return response.json()
}

export async function fetchMessages(chatId: string) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`)
  if (!response.ok) {
    throw new Error('Failed to fetch messages')
  }
  return response.json()
}

export async function sendMessage({ chatId, message }: { chatId: string; message: any }) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  return response.json()
}

export async function createChat(participants: string[]) {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ participants }),
  })
  if (!response.ok) {
    throw new Error('Failed to create chat')
  }
  return response.json()
}

export async function updatePresence({ chatId, userId, status }: { chatId: string; userId: string; status: string }) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/presence`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, status }),
  })
  if (!response.ok) {
    throw new Error('Failed to update presence')
  }
  return response.json()
}

