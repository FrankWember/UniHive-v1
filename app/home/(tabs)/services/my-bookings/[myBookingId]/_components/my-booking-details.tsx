"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookedServices, Service } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { cancelBooking, processPayment } from '@/actions/service-bookings'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, FileText } from 'lucide-react'

interface MyBookingDetailsProps {
  booking: BookedServices & { service: Service }
  userId: string
}

export function MyBookingDetails({ booking, userId }: MyBookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await cancelBooking(booking.id, userId)
      toast({ title: "Booking cancelled", description: "Your booking has been cancelled." })
      router.refresh()
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel the booking.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePay = async () => {
    setIsLoading(true)
    try {
      router.push(`/home/services/${booking.serviceId}/payment/${booking.id}`)
    } catch (error) {
      toast({ title: "Error", description: "Failed to process the payment.", variant: "destructive" })
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Status</span>
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
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Service</TableCell>
                <TableCell>{booking.service.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <Clock className="inline-block mr-2" /> Date and Time
                </TableCell>
                <TableCell>
                  {booking.startTime.toLocaleString()} - {booking.stopTime.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <DollarSign className="inline-block mr-2" /> Price
                </TableCell>
                <TableCell>${booking.price.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Notes</AlertTitle>
            <AlertDescription>
              {booking.notes || 'No additional notes'}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          {!booking.isCanceled && booking.status !== 'completed' && (
            <Button onClick={handleCancel} variant="destructive" disabled={isLoading}>
              Cancel Booking
            </Button>
          )}
          {booking.status === 'agreed' && !booking.isPaid && (
            <Button onClick={handlePay} disabled={isLoading}>
              Pay Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}