"use client"

import React, { useState, useEffect } from 'react'
import { BackButton } from '@/components/back-button'
import { Id } from '@/convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import axios from 'axios'
import { ChatList } from './_components/chat-list'
import { ChatInterface } from './_components/chat-interface'

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
    const user = useCurrentUser()
    const searchParams = useSearchParams()
    const chatId = searchParams.get('chatId')
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<Id<"chats">|null>(null)
    const [chats, setChats] = useState<Chat[]>([])

    

    // Move the redirect logic before any hooks
    React.useLayoutEffect(() => {
        if (!user || !user.id) {
            const callbackUrl = encodeURIComponent("/home/inbox")
            router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        }
    }, [user, router]);

    const allChats = useQuery(api.chats.getAllChats, {
        userId: user?.id || '',
    })

    useEffect(() => {
        const fetchChats = async () => {
            if (!allChats || allChats.length <= 0) return;
            setLoading(true)
            let allUserIds: string[] = allChats.map((chat) => chat.customerId)
            
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
                    const user = users.find((user: Customer) => user.id === chat.customerId || user.id === chat.sellerId);
                    return {
                        ...chat,
                        customer: user
                    };
                });

                setChats(resolvedChats);
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
    }, [allChats]);

    useEffect(() => {
        if (chatId && allChats) {
            const chat = allChats.find((chat) => chat._id === chatId)
            if (chat) {
                setCurrentChatId(chat._id)
            }
        }
    }, [chatId, allChats])

    // If no user, this will render null due to the useLayoutEffect redirect
    if (!user || !user.id) {
        return null;
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