"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChatList } from './chat-list'
import { ChatInterface } from './chat-interface'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
  SidebarRail
} from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'

interface ChatPlusUserId {
  _id: Id<"chats">
  userId: string
}

export interface Chat {
  _id: Id<"chats">
  sellerId: string
  customerId: string
  type: string
  customer: {
    name: string
    image?: string
  }
  lastMessage: {
    chatId: Id<"chats">
    senderId: string
    text: string
    timestamp: number
    read: boolean
  } | null
  unreadCount: number
}

interface Customer {
  id: string
  name?: string
  image?: string
}

export function ChatLayout({ chatId }: { chatId?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<Id<"chats"> | null>(
    chatId ? (chatId as Id<"chats">) : null
  )
  const [loading, setLoading] = useState(false)
  const user = useCurrentUser()
  
  if (!user?.id) return null;
  const userId = user.id;

  const currentChat = chats.find((chat) => chat._id === currentChatId)

  const allChats = useQuery(api.chats.getAllChats, userId ? { userId } : 'skip') || []

  useEffect(() => {
    const fetchChatsWithCustomer = async () => {
      if (!allChats.length) return

      setLoading(true)

      const allUserIds: ChatPlusUserId[] = allChats.map((chat) => ({
        _id: chat._id,
        userId: chat.customerId === userId ? chat.sellerId : chat.customerId
      }))

      const userIds = allUserIds.map((u) => u.userId)

      try {
        const { data: users }: { data: Customer[] } = await axios.post('/api/users', {
          userIds
        })

        const resolvedChats = allChats.map((chat) => {
          const userRef = allUserIds.find((id) => id._id === chat._id)
          const customer = users.find((u) => u.id === userRef?.userId)

          return {
            ...chat,
            customer: {
              name: customer?.name ?? 'Unknown',
              image: customer?.image
            }
          }
        })

        resolvedChats.sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0))
        setChats(resolvedChats)

        if (!currentChatId && resolvedChats.length > 0) {
          setCurrentChatId(resolvedChats[0]._id)
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChatsWithCustomer()
  }, [allChats, userId])

  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId as Id<"chats">)
    }
  }, [chatId])

  const handleChatSelect = (chatId: Id<"chats">) => {
    setCurrentChatId(chatId)
    if (isMobile) {
      router.push(`/home/inbox/${chatId}`)
    }
  }

  const isInboxPage = pathname === '/home/inbox'

  if (isMobile && !isInboxPage && currentChatId) {
    return (
      <div className="h-full w-full">
        <ChatInterface
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          userId={userId}
          participant={currentChat?.customer}
        />
      </div>
    )
  }

  if (isMobile && isInboxPage) {
    return (
      <div className="h-full w-full">
        <ChatList
          currentChatId={currentChatId}
          setCurrentChatId={handleChatSelect}
          loading={loading}
          userId={userId}
          chats={chats}
        />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4 flex gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push('/home/services')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">Inbox</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ChatList
            currentChatId={currentChatId}
            setCurrentChatId={handleChatSelect}
            loading={loading}
            userId={userId}
            chats={chats}
          />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {currentChatId ? (
          <ChatInterface
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
            userId={userId}
            participant={currentChat?.customer}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">
                  No Chat Selected
                </CardTitle>
                <CardDescription className="text-center">
                  Select a chat from the sidebar to start messaging.
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
