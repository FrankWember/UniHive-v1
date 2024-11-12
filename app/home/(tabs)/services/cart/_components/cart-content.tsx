"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookedServices, Service } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Separator } from "@/components/ui/separator"
import { processPayment } from '@/actions/service-bookings'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface CartContentProps {
  bookings: (BookedServices & {service: Service})[]
  userId: string
}

export function CartContent({ bookings, userId }: CartContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const unpaidBookings = bookings.filter(booking => !booking.isPaid && booking.status !== 'canceled')
  const incompleteBookings = bookings.filter(booking => booking.isPaid && !booking.isCompleted && booking.status !== 'canceled')

  const handlePayment = async (bookingId: string) => {
    setIsProcessing(bookingId)
    try {
      await processPayment(bookingId, userId, "credit_card") // You might want to implement a proper payment flow here
      toast({ title: "Payment processed", description: "Your payment has been processed successfully." })
      router.refresh()
    } catch (error) {
      toast({ title: "Error", description: "Failed to process the payment.", variant: "destructive" })
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl space-y-6"
    >
      {unpaidBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unpaid Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unpaidBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{booking.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.startTime).toLocaleString()} - {new Date(booking.stopTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">${booking.price.toFixed(2)}</p>
                  <Button
                    onClick={() => handlePayment(booking.id)}
                    disabled={isProcessing === booking.id}
                  >
                    {isProcessing === booking.id ? "Processing..." : "Pay"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {incompleteBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Incomplete Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incompleteBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{booking.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.startTime).toLocaleString()} - {new Date(booking.stopTime).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">{booking.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {bookings.length === 0 && (
        <Card>
          <CardContent className="text-center py-6">
            <p>Your cart is empty.</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="flex justify-between items-center">
        <p className="font-semibold">Total:</p>
        <p className="font-semibold">${unpaidBookings.reduce((total, booking) => total + booking.price, 0).toFixed(2)}</p>
      </div>

      <Button className="w-full" disabled={unpaidBookings.length === 0}>
        Checkout All
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Need to discuss?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>If you need to discuss any details about your bookings, you can chat with the service providers.</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/home/services/my-chats">Go to My Chats</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}