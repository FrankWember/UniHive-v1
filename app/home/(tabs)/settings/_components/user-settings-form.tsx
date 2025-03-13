"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { updateUserSettings } from '@/actions/user'
import { User } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BeatLoader } from 'react-spinners'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  student_id: z.string().min(5, {
    message: "Student ID must be at least 5 characters.",
  }),
  phone_number: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }).optional(),
})

export function UserSettingsForm({ userData }: { userData: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.name || "",
      student_id: userData?.studentId || "",
      phone_number: userData?.phone || "",
      bio: userData?.bio || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    setSuccess("");
    setIsSubmitting(true)
    try {
      await updateUserSettings(values)
      setSuccess("User settings updated successfully");
    } catch (error) {
      console.error('Error updating user settings:', error)
      setError("Error updating user settings");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='bg-muted/40'>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <Button type="button" onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                        {isSubmitting ? <BeatLoader /> : "Change"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <Button type="button" onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                        {isSubmitting ? <BeatLoader /> : "Change"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <Button type="button" onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                        {isSubmitting ? <BeatLoader /> : "Change"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <div className="flex flex-col space-y-2">
                    <FormControl>
                      <Textarea {...field} placeholder='Describe yourself to customers and sellers...' className='min-h-36' disabled={isSubmitting} />
                    </FormControl>
                    <Button type="button" onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                        {isSubmitting ? <BeatLoader /> : "Change"}
                    </Button>
                  </div>
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
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}