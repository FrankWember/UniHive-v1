"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Service } from '@prisma/client'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MultiImageUpload } from '@/components/multi-image-upload'
import { updateService } from '@/actions/services'
import { useRouter } from 'next/navigation'
import { BeatLoader } from 'react-spinners'

const portfolioFormSchema = z.object({
  portfolio: z.array(z.string().url()).min(1, {
    message: "At least one portfolio image is required.",
  }),
})

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>

interface PortfolioFormProps {
  service: Service
}

export const PortfolioForm = ({ service }: PortfolioFormProps) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const router = useRouter()
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      portfolio: service.portfolio,
    },
  })

  const handleSubmit = async (values: PortfolioFormValues) => {
    setIsSubmitting(true)
    try {
      await updateService(service.id, {
        portfolio: values.portfolio,
        name: service.name,
        price: service.price,
        category: service.category,
        images: service.images,
        defaultLocation: service.defaultLocation || "",
        isMobile: service.isMobileService,
        availability: service.availability as Record<string, [string, string][]>
       })
      router.push(`/home/services/${service.id}`)
    } catch (error) {
      console.error("AN err occured")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio Images</FormLabel>
              <FormControl>
                <MultiImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={5}
                />
              </FormControl>
              <FormDescription>
                Upload up to 5 images showcasing your work.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <BeatLoader/> : "Update Portfolio"}
        </Button>
      </form>
    </Form>
  )
}