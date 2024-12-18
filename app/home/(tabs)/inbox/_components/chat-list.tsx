"use client"

import React, { useEffect } from 'react'
import { Chat } from '../page'
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
import { Input } from '@/components/ui/input';
import {
    PanelRight,
    Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ChatListSkeleton } from './chat-list-skeleton'
import { Id } from '@/convex/_generated/dataModel'
import { format } from 'date-fns'
import { useIsMobile } from '@/hooks/use-mobile'

interface ChatListProps {
    currentChatId: Id<"chats"> | null
    setCurrentChatId: React.Dispatch<React.SetStateAction<Id<"chats"> | null>>
    loading: boolean
    userId: string,
    chats: Chat[]
}

export const ChatList = ({ currentChatId, setCurrentChatId, userId, chats, loading=false }: ChatListProps) => {
    const [open, setOpen] = React.useState(true);
    const [search, setSearch] = React.useState('');

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                    <PanelRight className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-screen md:max-w-sm mx-0">
                <SheetHeader className="px-4">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search chats"
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </SheetHeader>
                <ScrollArea className="w-full h-[80vh]">
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
                                    setOpen(false)
                                }}
                            >
                                <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src={chat.customer?.image || undefined} alt={chat.customer?.name} className='object-cover' />
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
                                        <p className="text-sm text-muted-foreground truncate">
                                            {chat.lastMessage.text}
                                        </p>
                                    )}
                                </div>
                                </div>
                            </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </ScrollArea>
            </SheetContent>
        </Sheet>
  )
}
