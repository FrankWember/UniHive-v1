"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookedServices, Service, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { agreeBooking, cancelBooking } from '@/actions/service-bookings'
import { useToast } from '@/hooks/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, DollarSign, FileText, MapIcon, User as UserIcon } from 'lucide-react'

interface BookingDetailsProps {
  booking: BookedServices & { service: Service, buyer: User }
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const currentUser = useCurrentUser()

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
      await cancelBooking(booking.id, currentUser!.id!)
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
                <TableCell className="font-medium"><UserIcon className="inline-block mr-2" /> Customer</TableCell>
                <TableCell>{booking.buyer.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium"><Clock className="inline-block mr-2" /> Date and Time</TableCell>
                <TableCell>{booking.startTime.toLocaleString()} - {booking.stopTime.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium"><DollarSign className="inline-block mr-2" /> Price</TableCell>
                <TableCell>${booking.price.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium"><MapIcon className="inline-block mr-2" /> Location</TableCell>
                <TableCell>{booking.location || booking.service.defaultLocation}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Notes</AlertTitle>
            <AlertDescription>
              {booking.notes || 'No notes provided'}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          {!booking.isAgreed && booking.service.providerId === currentUser!.id && (
            <Button onClick={handleAgree} disabled={isLoading}>
              Agree to Booking
            </Button>
          )}
          {!booking.isCanceled && (
            <Button onClick={handleCancel} variant="destructive" disabled={isLoading}>
              Cancel Booking
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}