'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWebSocket } from '@/hooks/useWebSocket'
import { fetchChats, sendMessage, createChat, updatePresence } from '@/lib/api'
import dynamic from 'next/dynamic'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Image, Mic } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const MessageList = dynamic(() => import('./MessageList'), { ssr: false })

type MessageType = 'text' | 'image' | 'audio'

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [messageType, setMessageType] = useState<MessageType>('text')
  const queryClient = useQueryClient()

  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats
  })

  const { lastMessage, error: wsError } = useWebSocket(selectedChat)

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    },
  })

  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })

  const updatePresenceMutation = useMutation({
    mutationFn: updatePresence,
  })

  useEffect(() => {
    if (lastMessage) {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat] })
      if (lastMessage.event === 'presence_updated' && lastMessage.data.user_id !== 'user1') {
        setOtherUserTyping(lastMessage.data.status === 'typing')
      }
    }
  }, [lastMessage, queryClient, selectedChat])

  useEffect(() => {
    let typingTimer: NodeJS.Timeout
    if (isTyping) {
      updatePresenceMutation.mutate({ chatId: selectedChat!, userId: 'user1', status: 'typing' })
      typingTimer = setTimeout(() => {
        setIsTyping(false)
        updatePresenceMutation.mutate({ chatId: selectedChat!, userId: 'user1', status: 'online' })
      }, 2000)
    }
    return () => clearTimeout(typingTimer)
  }, [isTyping, selectedChat, updatePresenceMutation])

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSendMessage = () => {
    if (selectedChat && message.trim()) {
      if ((messageType === 'image' || messageType === 'audio') && !isValidUrl(message)) {
        toast({
          title: "Invalid URL",
          description: `Please enter a valid ${messageType} URL.`,
          variant: "destructive",
        })
        return
      }

      sendMessageMutation.mutate({
        chatId: selectedChat,
        message: {
          user_id: 'user1',
          type: messageType,
          content: message,
        },
      })
      setMessage('')
      setIsTyping(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    setIsTyping(true)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCreateChat = () => {
    createChatMutation.mutate(['user1', 'bot_user'])
  }

  return (
    <div className="w-full max-w-4xl h-[600px] bg-white shadow-xl rounded-lg flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b"
      >
        <Button onClick={handleCreateChat}>
          {'Create Chat with Robot'}
        </Button>
      </motion.div>
      {wsError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{wsError}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-1 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 border-r md:block hidden"
        >
          <ScrollArea className="h-full">
            <AnimatePresence>
              {chats?.map((chat) => (
                <motion.div
                  key={chat.chat_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 cursor-pointer hover:bg-gray-100 ${
                    selectedChat === chat.chat_id ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => setSelectedChat(chat.chat_id)}
                >
                  {chat.participants.join(', ')}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-2/3 flex flex-col"
        >
          {selectedChat ? (
            <>
              <MessageList chatId={selectedChat} />
              <div className="p-4 flex flex-col">
                <div className="flex items-center mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMessageType('text')}
                    className={messageType === 'text' ? 'bg-gray-200' : ''}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMessageType('image')}
                    className={messageType === 'image' ? 'bg-gray-200' : ''}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMessageType('audio')}
                    className={messageType === 'audio' ? 'bg-gray-200' : ''}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={`Enter ${messageType} URL or message...`}
                  className="flex-grow mb-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {otherUserTyping ? 'Other user is typing...' : ''}
                  </span>
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

