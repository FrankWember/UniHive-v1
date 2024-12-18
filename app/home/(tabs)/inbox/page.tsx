"use client"

import React, { useState, useEffect, use } from 'react'
import { BackButton } from '@/components/back-button'
import { Id } from '@/convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import axios, { all } from 'axios'
import { ChatList } from './_components/chat-list'
import { ChatInterface } from './_components/chat-interface'

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
        image: string|null
    } | undefined
    lastMessage: {
        chatId: Id<"chats">
        senderId: string
        text: string
        timestamp: number
        read: boolean
    } | null
}

interface Customer {
    id: string
    name: string|null
    image: string|null
}

const InboxPage = () => {
    const me = useCurrentUser()
    const [user, setUser] = useState(me)
    const searchParams = useSearchParams()
    const chatId = searchParams.get('chatId')
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<Id<"chats">|null>(null)
    const [chats, setChats] = useState<Chat[]>([])

    

    // Move the redirect logic before any hooks
    React.useEffect(() => {
        setUser(me)
        if (!user || !user.id) {
            const callbackUrl = encodeURIComponent("/home/inbox")
            router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        }
    }, [user, router, me]);

    const allChats = useQuery(api.chats.getAllChats, {
        userId: user?.id || '',
    })

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
                console.log("ALL_CHATS: ", allChats)
                const resolvedChats = allChats.map((chat) => {
                    const user = users.find((user: Customer) => {
                        return allUserIds.find((id) => id.userId === user.id)?._id === chat._id
                    })
                    console.log('USER:', user)
                    return {
                        ...chat,
                        customer: user
                    };
                });

                setChats(resolvedChats);
                console.log('RESOLVED CHATS:', resolvedChats);
                if (!currentChatId && resolvedChats[0]) {
                    setCurrentChatId(resolvedChats[0]._id);
                }
            } catch (error) {
                console.error('Failed to fetch chats', error);
            } finally {
                setLoading(false)
            }
        };

        fetchChats();
    }, [allChats, me, user]);

    React.useLayoutEffect(() => {
        if (chatId && allChats) {
            const chat = allChats.find((chat) => chat._id === chatId)
            if (chat) {
                setCurrentChatId(chat._id)
            }
        }
    }, [chatId, allChats, me])

    if (!user || !user.id) {
        const callbackUrl = encodeURIComponent("/home/inbox")
        router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        return null
    }

    return (
        <div className="flex flex-col min-h-screen w-screen">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
                <div className="flex items-center gap-3">
                    <BackButton />
                    <h1 className="text-2xl font-bold">
                        {currentChatId ? chats.find((chat) => chat._id === currentChatId)?.customer?.name : "Inbox"}
                    </h1>
                </div>
                <ChatList 
                    currentChatId={currentChatId} 
                    setCurrentChatId={setCurrentChatId} 
                    chats={chats}
                    userId={user.id}
                    loading={loading}
                />
            </div>

            {/* Content */}
            <div className="flex w-screen h-full justify-center pt-24">
                <ChatInterface 
                    currentChatId={currentChatId} 
                    setCurrentChatId={setCurrentChatId} 
                    userId={user.id}
                />
            </div>
        </div>
    )
}

export default InboxPage