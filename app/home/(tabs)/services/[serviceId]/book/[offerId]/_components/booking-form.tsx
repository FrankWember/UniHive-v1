"use client"

import { useState, useMemo, useEffect } from 'react'
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Calendar } from '@/components/ui/calendar'
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons'
import { LocationInput } from '@/components/location-input'
import { createBooking } from '@/actions/service-bookings'
import { cn } from '@/lib/utils'
import { BeatLoader } from 'react-spinners'
import { Service, ServiceBooking, ServiceOffer } from '@prisma/client'
import { ServiceBookingSchema } from '@/constants/zod'
import { findAvailableSlots } from '@/utils/helpers/availability'
import { JsonValue } from '@prisma/client/runtime/library'

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

function isDayAvailability(obj: any): obj is Availability {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.every(day => 
      obj[day] === undefined || 
      Array.isArray(obj[day]) && 
      obj[day].every(slot => Array.isArray(slot) && slot.length === 2)
  );
}

interface Booking {
  date: Date,
  time: JsonValue,
  customer: {
    image: string|null
  }
}

interface BookingFormProps {
  offerId: string
  service: Service & {
    offers: (ServiceOffer & {
      bookings: Booking[]
    })[]
    availability: Availability | null
  },
  offer: ServiceOffer
}


export function BookingForm({ offerId, service, offer }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[] | null>(null)
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

  var totalBookings:Booking[]  = []
  service.offers.map(offer=>totalBookings=totalBookings.concat(offer.bookings))

  const form = useForm<z.infer<typeof ServiceBookingSchema>>({
    resolver: zodResolver(ServiceBookingSchema),
    defaultValues: {
      location: service.defaultLocation!
    }
  })

  function getDaysSlot (date: Date = new Date()) {
    if (service.availability) {
      const slots = isDayAvailability(service.availability) ?
        findAvailableSlots(service.availability, date, offer.duration || 0, totalBookings) :
        null;
      setAvailableSlots(slots);
    }
  }
    
  const onSubmit = async (values: z.infer<typeof ServiceBookingSchema>) => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")
      await createBooking(offerId, values)
      setSuccess("Your booking has been made!")
      router.push(`/home/services/${service.id}`)
      router.refresh()
    } catch (error) {
      console.error(error)
      setError("An error occurred while booking the service.")
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
                onSelect={(value) => {
                  field.onChange(value)
                  getDaysSlot(value)
                }}
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
                onValueChange={(value)=>field.onChange([value.split(' - ')])} 
                >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableSlots && availableSlots?.map((slot, index) => (
                    <SelectItem 
                      key={index} 
                      value={`${slot[0]} - ${slot[1]}`}>
                      {`${slot[0]}  ~to~  ${slot[1]}`}
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <BeatLoader /> : "Book"}
        </Button>
      </form>
    </Form>
  )
}