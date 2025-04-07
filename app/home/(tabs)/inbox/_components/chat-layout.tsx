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

  const user = useCurrentUser()
  const userId = user?.id

  const [mounted, setMounted] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<Id<"chats"> | null>(
    chatId ? (chatId as Id<"chats">) : null
  )
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const allChats = useQuery(api.chats.getAllChats, userId ? { userId } : "skip")
  const isInboxPage = pathname === '/home/inbox'

  // Delay rendering until mounted (for hydration safety)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  // Block rendering until user is available
  if (!userId) {
    return <div className="flex h-full items-center justify-center">Loading user...</div>
  }

  // Fetch user info for chat partners
  useEffect(() => {
    const fetchChatsWithCustomer = async () => {
      if (!allChats || allChats.length === 0) return

      setLoading(true)
      setErrorMessage(null)

      // Create an array of user IDs we need to fetch
      const userIds = allChats.map(chat => 
        chat.customerId === userId ? chat.sellerId : chat.customerId
      )

      try {
        console.log("Fetching user data with IDs:", userIds)
        
        const response = await axios.post('/api/users', { userIds })
        const users: Customer[] = response.data
        
        console.log("Received user data:", users)

        // Map chat partners to each chat
        const resolvedChats = allChats.map((chat) => {
          const partnerId = chat.customerId === userId ? chat.sellerId : chat.customerId
          const customer = users.find((u) => u.id === partnerId)

          return {
            ...chat,
            customer: {
              name: customer?.name ?? 'Unknown',
              image: customer?.image
            }
          }
        })

        // Sort by most recent message
        resolvedChats.sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0))
        setChats(resolvedChats)

        // Auto-select first chat if none selected
        if (!chatId && resolvedChats.length > 0 && currentChatId === null) {
          const firstChatId = resolvedChats[0]._id
          setCurrentChatId(firstChatId)
          if (isMobile) {
            router.push(`/home/inbox/${firstChatId}`)
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setErrorMessage('Failed to load chat participants. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchChatsWithCustomer()
  }, [allChats, userId, chatId, currentChatId, isMobile, router])

  // Sync URL chatId to state if necessary
  useEffect(() => {
    if (chatId && currentChatId !== chatId) {
      setCurrentChatId(chatId as Id<"chats">)
    }
  }, [chatId, currentChatId])

  const handleChatSelect = (chatId: Id<"chats">) => {
    setCurrentChatId(chatId)
    if (isMobile) {
      router.push(`/home/inbox/${chatId}`)
    }
  }

  // Display error if any
  if (errorMessage) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">Error</CardTitle>
            <CardDescription className="text-center text-red-500">{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Wait for chats to load
  if (allChats === undefined) {
    return <div className="flex h-full items-center justify-center">Loading inbox...</div>
  }

  // ✅ MOBILE: chat view only
  if (isMobile && !isInboxPage && currentChatId) {
    return (
      <div className="h-full w-full">
        <ChatInterface
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          userId={userId}
          participant={chats.find((c) => c._id === currentChatId)?.customer ?? { name: "Unknown" }}
        />
      </div>
    )
  }

  // ✅ MOBILE: chat list only
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

  // ✅ DESKTOP: Full layout
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
            participant={chats.find((c) => c._id === currentChatId)?.customer ?? { name: "Unknown" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">No Chat Selected</CardTitle>
                <CardDescription className="text-center">Select a chat from the sidebar to start messaging.</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}