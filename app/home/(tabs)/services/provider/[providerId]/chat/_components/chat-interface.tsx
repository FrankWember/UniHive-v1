"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from '@/lib/firebase'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore'

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})

interface ChatInterfaceProps {
  userId: string
  providerId: string
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Timestamp
}

export function ChatInterface({ userId, providerId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  useEffect(() => {
    const chatId = [userId, providerId].sort().join('_')
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = []
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message)
      })
      setMessages(fetchedMessages)
    })

    return () => unsubscribe()
  }, [userId, providerId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const chatId = [userId, providerId].sort().join('_')
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderId: userId,
      text: values.message,
      timestamp: serverTimestamp(),
    })
    form.reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <Card className="h-[calc(100vh-150px)]">
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-230px)] p-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div
                key={message.id}
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
    </motion.div>
  )
}