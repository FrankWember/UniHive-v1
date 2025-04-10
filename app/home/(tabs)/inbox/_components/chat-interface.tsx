"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { BeatLoader } from 'react-spinners'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronLeft } from 'lucide-react'

interface ChatInterfaceProps {
  currentChatId: Id<"chats"> | null
  setCurrentChatId: React.Dispatch<React.SetStateAction<Id<"chats"> | null>>
  userId: string
  participant?: { name: string, image?: string }
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

export const ChatInterface = ({ currentChatId, setCurrentChatId, userId, participant }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [sendingMessage, setSendingMessage] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const sendMessage = useMutation(api.messages.sendMessage)
  const markAsRead = useMutation(api.messages.markAsRead)
  const router = useRouter()
  const isMobile = useIsMobile()

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
    if (!chatMessages || !currentChatId) return;
    setMessages(chatMessages);

    const makeAllAsRead = async () => {
      for (const message of chatMessages) {
        if (!message.read && message.senderId !== userId) {
          await markAsRead({ messageId: message._id! });
        }
      }
    }

    makeAllAsRead()
  }, [chatMessages, currentChatId, markAsRead, userId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSendingMessage(true)
    await sendMessage({
      chatId: currentChatId!,
      senderId: userId,
      text: values.message
    })
    form.reset()
    setSendingMessage(false)
  }

  const handleBackClick = () => {
    if (isMobile) {
      router.push('/home/inbox')
    }
  }

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col"
      >
      <Card className="flex flex-col h-full">
        {isMobile && (
          <div className="p-3 border-b flex items-center">
            <Button variant="outline" size="sm" onClick={handleBackClick} className="mr-2">
              <ChevronLeft className='h-4 w-4' />
              <span className='sr-only'>Back</span>
            </Button>
            <Avatar className="w-10 h-10 mr-2">
              {participant?.image ? (
                <img src={participant.image} alt={participant.name} className="rounded-full object-cover" />
              ) : (
                <AvatarFallback>{participant?.name?.charAt(0) ?? '?'}</AvatarFallback>
              )}
            </Avatar>
            <h2 className="font-semibold text-lg truncate">{participant?.name ?? 'Chat'}</h2>
          </div>
        )}

          <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.map((message) => {
              const isMe = message.senderId === userId
              const avatarImage = isMe ? undefined : participant?.image
              const avatarName = isMe ? 'Me' : participant?.name

              return (
                <div
                  key={message._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8">
                      {avatarImage ? (
                        <img src={avatarImage} alt={avatarName} className="rounded-full object-cover" />
                      ) : (
                        <AvatarFallback>{avatarName?.charAt(0) ?? '?'}</AvatarFallback>
                      )}
                    </Avatar>

                    <div
                      className={`flex flex-col mx-2 p-3 rounded-2xl max-w-[75%] shadow ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <span className="text-md whitespace-pre-wrap">{message.text}</span>
                      <span
                        className={`w-full flex justify-end text-[0.7rem] mt-1 ${
                          isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'
                        }`}
                      >
                        {new Intl.DateTimeFormat(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }).format(new Date(message.timestamp))}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </ScrollArea>
        </CardContent>

       <CardFooter className="border-t p-3 bg-background z-10 mb-12">
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
          {sendingMessage ? <BeatLoader size={8} /> : <PaperPlaneIcon />}
        </Button>
      </form>
    </Form>
  </CardFooter>
      </Card>
    </motion.div>
  )
}
