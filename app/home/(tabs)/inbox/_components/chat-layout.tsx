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
import { ChevronLeft, HomeIcon } from 'lucide-react'
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
    } | null,
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
  const [currentChatId, setCurrentChatId] = useState<Id<"chats"> | null>(chatId ? chatId as Id<"chats"> : null)
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser()
  const userId = user?.id!
  const currentChat = chats.find(chat => chat._id === currentChatId)
  
  // Fetch chats from Convex
  const allChats = useQuery(api.chats.getAllChats,
    userId ? { userId: userId } : "skip"
  ) || []

  useEffect(() => {
    const fetchChats = async () => {
        if (!allChats || allChats.length <= 0) return;
        setLoading(true)
        let allUserIds: ChatPlusUserId[] = allChats.map((chat) => {
            if (chat.customerId === user?.id) {
                return {_id: chat._id, userId: chat.sellerId}
            }
            return {_id: chat._id, userId: chat.customerId}
        })
        
        try {
            const { data: users } = await axios.get(`/api/users`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    userIds: allUserIds
                }
            });  
            const resolvedChats = allChats.map((chat) => {
              const user = users.find((user: Customer) => {
                return allUserIds.find((id) => id.userId === user.id)?._id === chat._id
              })
              return {
                ...chat,
                customer: user
              }
            })
            
            resolvedChats.sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0))
            

            setChats(resolvedChats);
            if (!currentChatId && resolvedChats[0]) {
                setCurrentChatId(resolvedChats[0]._id);
            }
        } finally {
            setLoading(false)
        }
    };

        fetchChats();
    }, [allChats, user]);

  // Update currentChatId when chatId prop changes
  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId as Id<"chats">)
    }
  }, [chatId])

  // Handle chat selection
  const handleChatSelect = (chatId: Id<"chats">) => {
    setCurrentChatId(chatId)
    if (isMobile) {
      router.push(`/home/inbox/${chatId}`)
    }
  }

  
  // Determine if we're on the main inbox page
  const isInboxPage = pathname === '/home/inbox'

  // For mobile: if we're on a specific chat page, only show the chat interface
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

  // For mobile: if we're on the main inbox page, only show the chat list
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

  // For desktop: show sidebar with chat list and chat interface or "no chat selected" card
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4 flex gap-4">
          <div className='flex items-center gap-2'>
            <Button variant="outline" size="icon" onClick={()=>router.push('/home/services')}>
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
                <CardTitle className="flex items-center justify-center text-2xl font-bold">
                  No Chat Selected
                </CardTitle>
                <CardDescription className="max-w-sm px-2 text-center">
                  Select a chat from the sidebar to start messaging.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}