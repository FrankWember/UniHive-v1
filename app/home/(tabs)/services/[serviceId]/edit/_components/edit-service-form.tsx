"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { CategorySelect } from '@/app/home/(tabs)/services/add/_components/category-select'
import { useRouter } from 'next/navigation'
import { updateService } from '@/actions/services'
import { ServiceSchema } from '@/constants/zod'
import { MultiImageUpload } from '@/components/multi-image-upload'


interface EditServiceFormProps {
  service: {
    id: string
    name: string
    description: string
    price: number
    category: string[]
    images: string[]
  }
}

export const EditServiceForm: React.FC<EditServiceFormProps> = ({ service }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter()

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      images: service.images,
    },
  })

  const onSubmit = async (values: z.infer<typeof ServiceSchema>) => {
    setError("")
    setSuccess("")
    setIsSubmitting(true)
    try {
      await updateService(service.id, values)
      setSuccess("Your servce has been updated")
      router.push(`/home/services/${service.id}`)
      router.refresh()
    } catch (error) {
      setError("We couldn't update your service. Please try again!")
      console.error('Error updating service:', error)
    } finally {
      setIsSubmitting(false)
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
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter service name" {...field} />
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
                <Textarea placeholder="Describe your service" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <CategorySelect value={field.value} onChange={field.onChange} />
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
              <FormLabel>Images</FormLabel>
              <FormControl>
                <MultiImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={5}
                />
              </FormControl>
              <FormDescription>Upload up to 5 images for your service.</FormDescription>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Service"}
        </Button>
      </form>
    </Form>
  )
}