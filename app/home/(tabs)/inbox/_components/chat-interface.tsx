"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardTitle, CardDescription, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { BeatLoader } from 'react-spinners'
import { PaperPlaneIcon } from '@radix-ui/react-icons'

interface ChatInterfaceProps {
    currentChatId: Id<"chats"> | null
    setCurrentChatId: React.Dispatch<React.SetStateAction<Id<"chats"> | null>>
    userId: string
}

interface Message {
    _id: string
    senderId: string
    text: string
    timestamp: number
    read: boolean
}

const formSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
})

export const ChatInterface = ({ currentChatId, setCurrentChatId, userId }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [sendingMessage, setSendingMessage] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const sendMessage = useMutation(api.messages.sendMessage)
    const markAsRead = useMutation(api.messages.markAsRead)
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        message: '',
      },
    })

    const chatMessages = useQuery(api.messages.getChatMessages, 
      currentChatId ? { chatId: currentChatId } : "skip"
    )
        
    useEffect(() => {
        if (chatMessages) {
            setMessages(chatMessages);
        }
        const makeAllAsRead = async () => {
            chatMessages?.forEach(async (message) => {
                if (!message.read) {
                    await markAsRead({
                        messageId: message._id!,
                    })
                }
            })
        }
        makeAllAsRead()

    }, [chatMessages, markAsRead])
  
    useEffect(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      }
    }, [messages])
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSendingMessage(true)
        const message = await sendMessage({
            chatId: currentChatId!,
            senderId: userId,
            text: values.message
        })
        form.reset()
        setSendingMessage(false)
    }
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto flex flex-col items-center justify-start"
      >
        {currentChatId ? (
            <Card className="h-[calc(100vh-14rem)] md:h-[calc(100vh-10rem)] w-full max-w-4xl px-2 fixed z-20">
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-18rem)] md:h-[calc(100vh-14rem)] p-4" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex items-end ${message.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{message.senderId === userId ? 'Me' : 'P'}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col mx-2 p-2 rounded-lg max-w-[80%] ${
                          message.senderId === userId ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}
                      >
                        <span className="text-sm">{message.text}</span>
                        <span className={`w-full flex justify-end text-[0.5rem] text-primary-foreground/70`}>
                          {new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(message.timestamp))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full space-x-2">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Type a message..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={sendingMessage}>
                    {sendingMessage?<BeatLoader />: <PaperPlaneIcon />}
                  </Button>
                </form>
              </Form>
            </CardFooter>
          </Card>
        ): (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                            No Chat Selected
                        </CardTitle>
                        <CardDescription className='max-w-sm px-2 text-center'>
                            Select a chat to start messaging.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )}
        
      </motion.div>
    )
}
