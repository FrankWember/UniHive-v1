"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServiceBooking, Service, User, ServiceOffer } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { acceptBooking, rejectBooking, cancelBooking } from '@/actions/service-bookings'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, Clock, DollarSign, FileText, MapIcon, MessageCircle, User as UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { JsonValue } from '@prisma/client/runtime/library'
import { parseBookingTime } from '@/utils/helpers/availability'

interface BookingDetailsProps {
  booking: ServiceBooking & { 
    offer: ServiceOffer, 
    customer: User 
  }
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await acceptBooking(booking.id)
      toast({ 
        title: "Booking accepted", 
        description: "An email has been sent to the customer." 
      })
      router.refresh()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to accept the booking.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await rejectBooking(booking.id)
      toast({ 
        title: "Booking rejected", 
        description: "An email has been sent to the customer." 
      })
      router.refresh()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to reject the booking.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await cancelBooking(booking.id, booking.customerId)
      toast({ 
        title: "Booking cancelled", 
        description: "All parties have been notified via email." 
      })
      router.refresh()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to cancel the booking.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeRange = (date: Date, time: JsonValue) => {
    const { startTime, endTime } = parseBookingTime(time) ?? {}
    const startDate = new Date(date)
    const endDate = new Date(date)
    const startTimeParts = startTime?.split('-')
    const endTimeParts = endTime?.split('-')

    startDate.setHours(parseInt(startTimeParts![0]), parseInt(startTimeParts![1]))
    endDate.setHours(parseInt(endTimeParts![0]), parseInt(endTimeParts![1]))
    return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Status</span>
          <Badge variant={
            booking.status === 'PENDING' ? 'warning' :
            booking.status === 'ACCEPTED' ? 'info' :
            booking.status === 'REJECTED' ? 'destructive' :
            booking.status === 'CANCELLED' ? 'destructive' :
            'default'
          }>
            {booking.status}
          </Badge>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <UserIcon className="inline-block mr-2" /> Customer
              </TableCell>
              <TableCell>{booking.customer.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <Clock className="inline-block mr-2" /> Date
              </TableCell>
              <TableCell>
                {new Date(booking.date).toLocaleDateString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <Calendar className="inline-block mr-2" /> Time
              </TableCell>
              <TableCell>
                {getTimeRange(booking.date, booking.time)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <DollarSign className="inline-block mr-2" /> Price
              </TableCell>
              <TableCell>${booking.offer.price.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <MapIcon className="inline-block mr-2" /> Location
              </TableCell>
              <TableCell>{booking.location || "Default Location"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between space-x-4">
        <Button 
          variant="secondary" 
          onClick={()=>router.push(`/home/inbox?recipientId=${booking.customerId}&chatType=services`)} 
          className='flex items-center'
        >
          <MessageCircle className='h-4 w-4 mr-2' />Chat
        </Button>
        {booking.status === 'PENDING' && (
          <>
            <Button 
              variant="outline" 
              onClick={handleReject} 
              disabled={isLoading}
            >
              Reject
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={isLoading}
            >
              Accept
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}