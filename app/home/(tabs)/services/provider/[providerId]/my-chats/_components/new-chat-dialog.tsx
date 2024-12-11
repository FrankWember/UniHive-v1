"use client"

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormControl, FormDescription, FormItem } from '@/components/ui/form';
import axios from 'axios'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { BeatLoader } from 'react-spinners'

interface ChatUser {
    id: string
    name: string
    image: string
}

const formSchema = z.object({
    userId: z.string()
})

interface NewChatDialogProps {
    currentChatId: Id<"chats"> | null
    setCurrentChatId: React.Dispatch<React.SetStateAction<Id<"chats"> | null>>
    sellerId: string
}

export const NewChatDialog = ({
    currentChatId,
    setCurrentChatId,
    sellerId
}: NewChatDialogProps) => {
    const [users, setUsers] = useState<ChatUser[]>()
    const [loading, setLoading] = useState(false)
    const createChat = useMutation(api.chats.createChat);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/customer')
                setUsers(data)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        
        fetchUsers()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          userId: '',
        },
      })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        const currentChat = useQuery(api.chats.getCustomerChat, {
            sellerId: sellerId,
            customerId: values.userId
        })
        if (currentChat){
            setCurrentChatId(currentChat._id!)
        } else {
            const chatId = await createChat({
                sellerId: sellerId,
                customerId: values.userId
            });
            setCurrentChatId(chatId);
        }
        setLoading(false)
    }

  return (
    <Dialog>
        <DialogTrigger>
            <Button>
                New Chat <MessageCircle className='ml-2 h-4 w-4' />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <DialogHeader>
                        <DialogTitle>Start A New Chat</DialogTitle>
                        <DialogDescription>You search and contact your customers right now.</DialogDescription>
                    </DialogHeader>
                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Command value={field.value} onChange={field.onChange} className="rounded-lg border shadow-md w-full h-[20rem]">
                                    <CommandInput placeholder="Type a command or search..." />
                                    <CommandList>
                                        <CommandEmpty>No User found.</CommandEmpty>
                                        <CommandGroup heading="Users">
                                            {users?.map((user) => (
                                                <CommandItem key={user.id} className="flex gap-3 items-center hover:bg-secondary focus:bg-secondary">
                                                    <Avatar className=''>
                                                        <AvatarImage src={user.image} />
                                                        <AvatarFallback>{user.name[0] || 'C'}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.name}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </FormControl>
                            <FormDescription>Select a User</FormDescription>
                        </FormItem>
                        )}
                    />
                    <DialogFooter className="flex flex-row items-center justify-end gap-3">
                        <DialogClose>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading? <BeatLoader /> : "Start"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}
