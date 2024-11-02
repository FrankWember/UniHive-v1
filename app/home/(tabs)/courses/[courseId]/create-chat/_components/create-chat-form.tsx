"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'
import { createStudyGroup } from '@/actions/study-groups'
import { UserSelect } from './user-select'
import { User } from '@prisma/client'
import { ChatSchema } from '@/constants/zod'


type ChatFormValues = z.infer<typeof ChatSchema>

interface CreateChatFormProps {
  courseId: string
}

export function CreateChatForm({ courseId }: CreateChatFormProps) {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const router = useRouter()

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: ChatFormValues) => {
    setError("")
    setSuccess("")
    try {
      await createStudyGroup(courseId, values.name)
      setSuccess("Group chat created successfully!")
      router.push(`/home/courses/${courseId}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating group chat:', error)
      setError("We couldn't create the group chat. Please try again!")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter chat name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-6 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <RocketIcon className="h-6 w-4"/>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <Button type="submit">Create Group Chat</Button>
      </form>
    </Form>
  )
}