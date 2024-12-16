"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from '@/components/ui/calendar'
import { TimePickerDemo } from '@/components/ui/time-picker-12h-demo'
import { LocationInput } from '@/components/location-input'
import { createBooking } from '@/actions/service-bookings'
import { cn } from '@/lib/utils'
import { BeatLoader } from 'react-spinners'
import { Service, ServiceOffer } from '@prisma/client'
import { ServiceBookingSchema } from '@/constants/zod'

type TimeSlot = [string, string];
type Availability = {
  monday?: TimeSlot[] | undefined;
  tuesday?: TimeSlot[] | undefined;
  wednesday?: TimeSlot[] | undefined;
  thursday?: TimeSlot[] | undefined;
  friday?: TimeSlot[] | undefined;
  saturday?: TimeSlot[] | undefined;
  sunday?: TimeSlot[] | undefined;
};

interface BookingFormProps {
  offerId: string
  service: Service & {
    offers: ServiceOffer[]
    availability: Availability | null
  },
  availableSlots: TimeSlot[] | null
}

export function BookingForm({ offerId, service, availableSlots }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Memoized function to check if a date is available
  const isDateAvailable = useMemo(() => {
    return (date: Date) => {
      // Get the day of the week (lowercase)
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
      const dayOfWeek = days[date.getDay()]

      // Check if the day exists in availability and has time slots
      return !!(service.availability?.[dayOfWeek] && service.availability[dayOfWeek]!.length > 0)
    }
  }, [service.availability])

  const form = useForm<z.infer<typeof ServiceBookingSchema>>({
    resolver: zodResolver(ServiceBookingSchema),
    defaultValues: {
      location: service.defaultLocation!
    }
  })

  const onSubmit = async (values: z.infer<typeof ServiceBookingSchema>) => {
    try {
      setIsLoading(true)

      await createBooking(offerId, values)

      router.push(`/home/services/${service.id}`)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => 
                  date < new Date() || 
                  !isDateAvailable(date)
                }
                className={cn("rounded-md border", !field.value && "text-muted-foreground")}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select 
                onValueChange={(value)=>field.onChange(value.split(' - '))} 
                defaultValue={`${field.value[0]} - ${field.value[1]}`}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableSlots?.map((slot, index) => (
                    <SelectItem 
                      key={index} 
                      value={`${slot[0]} - ${slot[1]}`}>
                      {`${new Date(slot[0]).toLocaleTimeString()} - ${new Date(slot[1]).toLocaleTimeString()}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location {service.isMobileService? "" : " (Not Mobile)"}</FormLabel>
              <FormControl>
                <LocationInput {...field} disabled={service.isMobileService?false:true} />
              </FormControl>
              <FormMessage />
              {!service.isMobileService && (
                <FormDescription>You will have to get to the seller's location above</FormDescription>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <BeatLoader /> : "Book"}
        </Button>
      </form>
    </Form>
  )
}