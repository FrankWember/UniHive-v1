"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { bookService } from '@/actions/services'
import { Service } from '@prisma/client'
import { BeatLoader } from 'react-spinners'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'

const formSchema = z.object({
  dateTime: z.date({
    required_error: "A date is required",
  })
})

interface BookingFormProps {
  service: Service
  userId: string
}

export function BookingForm({ service, userId }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const bookedService = await bookService(service.id, userId, values.dateTime)
      router.push(`/home/services/payment/${bookedService.id}`)
    } catch (error) {
      console.error('Error booking service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        setDate={(newDate) => {
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <BeatLoader /> : "Book Service"}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}