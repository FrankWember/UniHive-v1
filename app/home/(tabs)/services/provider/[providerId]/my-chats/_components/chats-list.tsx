"use client"

import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import {
    PanelRight
} from 'lucide-react';
import { NewChatDialog } from './new-chat-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import RotatingLoader from '@/components/rotating-loader';

interface Chat {
    _id: string
    sellerId: string
    customerId: string
    customer: {
        name: string
        image: string|null
    } | undefined
    lastMessage: {
        chatId: string
        senderId: string
        text: string
        timestamp: number
        read: boolean
    } | null
}

interface ChatsListProps {
    currentChatId: Id<"chats"> | null
    setCurrentChatId: React.Dispatch<React.SetStateAction<Id<"chats"> | null>>
    sellerId: string
}

export const ChatsList = ({
    currentChatId,
    setCurrentChatId,
    sellerId
}: ChatsListProps) => {
    const sellerChats = useQuery(api.chats.getSellerChats, {
        sellerId: sellerId
    })
    const [chats, setChats] = React.useState<Chat[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchChats = async () => {
            if (!sellerChats || sellerChats.length <= 0) return;
            setLoading(true)
            const resolvedChats = await Promise.all(sellerChats.map(async (chat) => {
                const { data: customer } = await axios.get(`/api/customer/${chat.customerId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return {
                    ...chat,
                    customer
                };
            }));
            setLoading(false)
            setChats(resolvedChats);
        };
        fetchChats();
        if (!currentChatId && sellerChats && sellerChats[0]) setCurrentChatId(sellerChats[0]._id);
    }, [sellerChats]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                    <PanelRight className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold mb-6">Chats</SheetTitle>
                </SheetHeader>
                <ScrollArea className="w-full h-[80vh]">
                    <div className="felx flex-col space-y-2">
                        <NewChatDialog setCurrentChatId={setCurrentChatId} currentChatId={currentChatId} sellerId={sellerId} />
                        {chats.map((chat) => (
                            <div key={chat._id} className="flex items-center justify-start gap-2 p-3 border-t">
                                <Avatar className=''>
                                    <AvatarImage src={chat.customer!.image!} className="object-cover"/>
                                    <AvatarFallback>{chat.customer!.name[0] || 'C'}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col gap-2'>
                                    <span className='flex items-center gap-2 text-lg font-bold '>
                                        <span>{chat.customer!.name}</span>
                                        {chat.lastMessage && !chat.lastMessage.read && (<Badge variant="success"></Badge>)}
                                    </span>
                                    {chat.lastMessage && (
                                        <span className='flex items-center justify-between text-sm text-muted-foreground'>
                                            <span className='truncate'>{chat.lastMessage && chat.lastMessage!.text || 'No messages yet'} </span>
                                            <span className='ml-2 text-xs text-muted-foreground'>
                                                {new Date(chat.lastMessage!.timestamp).toLocaleTimeString()}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (<RotatingLoader size={100} />)}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
