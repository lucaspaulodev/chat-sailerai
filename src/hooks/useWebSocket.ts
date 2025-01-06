import { useState, useEffect, useCallback } from 'react';

export function useWebSocket(chatId: string | null) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const connect = useCallback(() => {
    if (chatId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/${chatId}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setTimeout(connect, 5000);
      };

      setSocket(ws);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      connect();
    }

    return () => {
      socket?.close();
      setSocket(null);
    };
  }, [connect, chatId]);

  return { lastMessage };
}
