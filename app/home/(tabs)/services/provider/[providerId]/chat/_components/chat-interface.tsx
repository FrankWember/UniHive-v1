"use client"

import { useState, useEffect, useRef, useId } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})

interface ChatInterfaceProps {
  userId: string
  providerId: string
}

interface Message {
  _id: string
  chatId: string
  senderId: string
  text: string
  timestamp: number
  read: boolean
}

interface Chat {
  _id?: Id<"chats">
  customerId?: string | undefined,
  sellerId?: string | undefined,
  messages: Message[]
}

export function ChatInterface({ userId, providerId }: ChatInterfaceProps) {
  const sendMessage = useMutation(api.messages.sendMessage)
  const createChat = useMutation(api.chats.createChat)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  const chat = useQuery(api.chats.getCustomerChat, {
    sellerId: providerId,
    customerId: userId
  })

  const newChat = async () => {
    await createChat({
      sellerId: providerId,
      customerId: userId
    })
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef])
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const message = await sendMessage({
      chatId: chat?._id!,
      senderId: userId,
      text: values.message
    })
    form.reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl px-2 mx-auto flex flex-col items-center justify-start"
    >
      {!chat ? (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                    No Chat Yet
                </CardTitle>
                <CardDescription className='max-w-sm px-2 text-center'>
                    You have not started a chat with this provider yet.
                </CardDescription>
            </CardHeader>
            <CardFooter className='flex gap-3'>
                <Button onClick={newChat}>New Chat</Button>
            </CardFooter>
        </Card>
      ):(
        <Card className="h-[calc(100vh-14rem)]">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-18rem)] p-4" ref={scrollAreaRef}>
              {chat && chat.messages &&chat.messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-end ${message.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{message.senderId === userId ? 'You' : 'P'}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 py-2 px-3 rounded-lg ${
                        message.senderId === userId ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}
                    >
                      {message.text}
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
                <Button type="submit">Send</Button>
              </form>
            </Form>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  )
}