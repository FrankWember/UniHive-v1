"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookedServices, Service, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { agreeBooking, cancelBooking } from '@/actions/services'
import { useToast } from '@/hooks/use-toast'

interface BookingDetailsProps {
  booking: BookedServices & { service: Service, buyer: User }
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const handleAgree = async () => {
    setIsLoading(true)
    try {
      await agreeBooking(booking.id)
      toast({ title: "Booking agreed", description: "You have agreed to this booking." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to agree to the booking.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await cancelBooking(booking.id)
      toast({ title: "Booking cancelled", description: "You have cancelled this booking." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel the booking.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold">Booking Status</h3>
        <Badge variant={
            booking.status === 'pending' ? 'warning' :
            booking.status === 'agreed' ? 'info' :
            booking.status === 'paid' ? 'success' :
            booking.status === 'completed' ? 'success' :
            booking.status === 'canceled' ? 'destructive' :
            'default'
            }>
            {booking.status}
        </Badge>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Customer</h3>
        <p>{booking.buyer.name}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Date and Time</h3>
        <p>{booking.startTime.toLocaleString()} - {booking.stopTime.toLocaleString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Price</h3>
        <p>${booking.price.toFixed(2)}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Notes</h3>
        <p>{booking.notes || 'No notes provided'}</p>
      </div>
      <div className="flex space-x-4">
        {!booking.isAgreed && (
          <Button onClick={handleAgree} disabled={isLoading}>
            Agree to Booking
          </Button>
        )}
        {!booking.isCanceled && (
          <Button onClick={handleCancel} variant="destructive" disabled={isLoading}>
            Cancel Booking
          </Button>
        )}
      </div>
    </motion.div>
  )
}