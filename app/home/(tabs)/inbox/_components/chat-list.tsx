"use client"

import React, { useEffect } from 'react'
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
  console.log("[ChatList] Rendering with props:", { currentChatId, userId, chatsCount: chats.length, loading })
  
  const router = useRouter()
  const isMobile = useIsMobile()
  console.log("[ChatList] Device type:", isMobile ? "Mobile" : "Desktop")
  
  // Log detailed chat information on mount and updates
  useEffect(() => {
    console.log("[ChatList] Detailed chats data:", chats)
    console.log("[ChatList] Current chat ID:", currentChatId)
  }, [chats, currentChatId])

  return (
    <AnimatePresence>
      {loading ? (
        <React.Fragment>
          {console.log("[ChatList] Rendering loading skeleton")}
          <ChatListSkeleton />
        </React.Fragment>
      ) : (
        chats.map((chat) => {
          const customerName = chat.customer?.name ?? 'Unknown'
          const customerInitial = customerName.charAt(0)
          const isActive = currentChatId === chat._id
          
          console.log(`[ChatList] Rendering chat item: ${chat._id}`, { 
            customerName, 
            hasImage: !!chat.customer?.image,
            lastMessage: chat.lastMessage?.text,
            timestamp: chat.lastMessage?.timestamp,
            unreadCount: chat.unreadCount,
            isActive
          })

          return (
            <motion.div
              key={chat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-4 border-b cursor-pointer hover:bg-muted transition-colors ${
                isActive ? 'bg-muted' : ''
              }`}
              onClick={() => {
                console.log(`[ChatList] Chat clicked: ${chat._id}`)
                setCurrentChatId(chat._id)
                if (isMobile) {
                  console.log(`[ChatList] Navigating to chat on mobile: ${chat._id}`)
                  router.push(`/home/inbox/${chat._id}`)
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={chat.customer?.image || ''} alt={customerName} className="object-cover" />
                  <AvatarFallback>{customerInitial}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold truncate">{customerName}</h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(chat.lastMessage.timestamp), 'HH:mm')}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage.text}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge variant="default" className="text-xs min-w-[1.5rem] text-center">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })
      )}
    </AnimatePresence>
  )
}