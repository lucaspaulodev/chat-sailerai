'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchMessages } from '@/lib/api'
import LinkPreview from './LinkPreview'

interface MessageListProps {
  chatId: string
}

export default function MessageList({ chatId }: MessageListProps) {
  const { data: messages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetchMessages(chatId)
  })

  return (
    <ScrollArea className="flex-grow p-4">
      <AnimatePresence>
        {messages?.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 ${
              message.user_id === 'user1' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.user_id === 'user1'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.type === 'text' ? message.content : <LinkPreview content={message.content} type={message.type} />}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  )
}