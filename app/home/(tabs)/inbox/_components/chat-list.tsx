"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatListSkeleton } from './chat-list-skeleton'
import { Id } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/ui/badge'

interface Chat {
  _id: Id<"chats">
  customer?: {
    name: string
    image?: string
  }
  lastMessage?: {
    text: string
    timestamp: number
  } | null
  unreadCount: number
}

interface ChatListProps {
  currentChatId: Id<"chats"> | null
  setCurrentChatId: (chatId: Id<"chats">) => void
  loading: boolean
  userId: string
  chats: Chat[]
}

export const ChatList = ({ currentChatId, setCurrentChatId, userId, chats, loading = false }: ChatListProps) => {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <AnimatePresence>
      {loading ? (
        <ChatListSkeleton />
      ) : (
        chats.map((chat) => (
          <motion.div
            key={chat._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`p-4 border-b cursor-pointer hover:bg-muted transition-colors ${
              currentChatId === chat._id ? 'bg-muted' : ''
            }`}
            onClick={() => {
              setCurrentChatId(chat._id)
              if (isMobile) {
                router.push(`/home/inbox/${chat._id}`)
              }
            }}
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={chat.customer?.image || ""} alt={chat.customer?.name} className="object-cover" />
                <AvatarFallback>{chat.customer?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold truncate">{chat.customer?.name}</h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(chat.lastMessage.timestamp), 'HH:mm')}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <div className='flex items-center justify-between gap-2'>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.text}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge variant="default" className='text-xs'>
                        {chat.unreadCount ?? 0}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </AnimatePresence>
  )
}