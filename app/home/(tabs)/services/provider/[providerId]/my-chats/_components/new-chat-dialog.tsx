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
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { CheckCircledIcon, ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormControl, FormDescription, FormItem, FormMessage } from '@/components/ui/form';
import axios from 'axios'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { BeatLoader } from 'react-spinners'
import RotatingLoader from '@/components/rotating-loader'

interface ChatUser {
    id: string
    name: string
    image: string
}

const formSchema = z.object({
    userId: z.string().min(2, {
        message: "Name must be at least 2 characters.",
      }),
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
    const [gettingUsers, setGettingUsers] = useState(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [open, setOpen] = React.useState(false)
    const createChat = useMutation(api.chats.createChat);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setGettingUsers(true)
                const { data } = await axios.get('/api/customer')
                setUsers(data)
            } catch (error) {
                console.error('Error fetching users:', error)
            } finally {
                setGettingUsers(false)
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

    const currentChat = useQuery(api.chats.getCustomerChat, {
        sellerId: sellerId,
        customerId: form.getValues('userId')
    })
    

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Started Submitting", "Values:", values)
        try {
            setError("")
            setSuccess("")
            setLoading(true)
            if (currentChat && currentChat._id) {
                setCurrentChatId(currentChat._id!)
                setSuccess("You already had a chat with this user")
            } else {
                const chatId = await createChat({
                    sellerId: sellerId,
                    customerId: values.userId
                });
                setCurrentChatId(chatId);
                setSuccess("Chat created successfully!")
            }
        } catch (error) {
            setError("We couldn't create your chat. Please try again!")
            console.error('Error creating chat:', error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                        <DialogDescription>You can search and contact your customers right now.</DialogDescription>
                    </DialogHeader>
                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Command className="rounded-lg border shadow-md w-full h-[20rem]">
                                    <CommandInput placeholder="Type a command or search..." />
                                    <CommandList>
                                        <CommandEmpty>No User found.</CommandEmpty>
                                        <CommandGroup heading="Users">
                                            {users && users.map((user) => (
                                                <CommandItem
                                                    key={user.name}
                                                    className="flex gap-3 items-center"
                                                    onSelect={() => {
                                                        field.onChange(user.id)
                                                    }}
                                                >
                                                    <Avatar className=''>
                                                        <AvatarImage src={user.image} />
                                                        <AvatarFallback>{user.name[0] || 'C'}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.name}</span>
                                                    {field.value === user.id && (
                                                        <CheckCircledIcon />
                                                    )}
                                                </CommandItem>
                                            ))}
                                            {gettingUsers && (<RotatingLoader size={50} />)}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </FormControl>
                            <FormDescription>Select a User</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {error && (
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="h-6 w-6" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert>
                            <RocketIcon className="h-6 w-6"/>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
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
