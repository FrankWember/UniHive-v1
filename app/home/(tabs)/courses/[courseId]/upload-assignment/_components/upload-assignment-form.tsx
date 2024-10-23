"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'
import { uploadAssignment } from '@/actions/assignments'
import { MultiFileUpload } from '@/components/multi-file-upload'

const AssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  file: z.string().min(1, "A file is required"),
})

type AssignmentFormValues = z.infer<typeof AssignmentSchema>

export function UploadAssignmentForm({ courseId }: { courseId: string }) {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const router = useRouter()

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      file: "",
    },
  })

  const onSubmit = async (values: AssignmentFormValues) => {
    setError("")
    setSuccess("")
    try {
      await uploadAssignment(courseId, values)
      setSuccess("Assignment uploaded successfully!")
      router.push(`/home/courses/${courseId}`)
      router.refresh()
    } catch (error) {
      console.error('Error uploading assignment:', error)
      setError("We couldn't upload your assignment. Please try again!")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter assignment title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter assignment description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment File</FormLabel>
              <FormControl>
                <MultiFileUpload
                  
                  value={field.value ? [field.value] : []}
                  onChange={(files) => field.onChange(files[0] || "")}
                  maxFiles={1}
                />
              </FormControl>
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
        <Button type="submit">Upload Assignment</Button>
      </form>
    </Form>
  )
}