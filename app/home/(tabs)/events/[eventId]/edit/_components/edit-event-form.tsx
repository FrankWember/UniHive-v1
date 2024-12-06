"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { MultiImageUpload } from '@/components/multi-image-upload'
import { updateEvent } from '@/actions/events'
import { useRouter } from 'next/navigation'
import { Event } from '@prisma/client'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/date-time-picker'
import { EventSchema } from '@/constants/zod'


export function EditEventForm({ event }: {event: Event}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      type: event.type,
      dateTime: new Date(),
      location: event.location,
      images: event.images,
    },
  })

  const onSubmit = async (values: z.infer<typeof EventSchema>) => {
    setError("")
    setSuccess("")
    try {
      await updateEvent(event.id, values)
      setSuccess("Your Event has been updated!")
      router.push(`/home/events/${event.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating event:', error)
      setError("We couldn't update your event. Please try again!")
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
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
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
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date and Time</FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <DatePicker
                    date={date}
                    setDate={(newDate) => {
                      setDate(newDate)
                      if (newDate) {
                        field.onChange(newDate)
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <TimePicker
                    date={date}
                    onChange={(newDate) => {
                      setDate(newDate)
                      if (newDate) {
                        field.onChange(newDate)
                      }
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Images</FormLabel>
              <FormControl>
                <MultiImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={5}
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
        <Button type="submit">Update Event</Button>
      </form>
    </Form>
  )
}