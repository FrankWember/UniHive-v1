"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ServiceBooking, ServiceOffer } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JsonValue } from '@prisma/client/runtime/library'
import { parseBookingTime } from '@/utils/helpers/availability'
import { format } from 'date-fns'
import { MessageCircle } from 'lucide-react'
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'

interface BookingsTableProps {
  bookings: (ServiceBooking & {
    offer: ServiceOffer
  })[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter()
  const user = useCurrentUser()
  const userId = user?.id!
  const { toast } = useToast()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const newChat = useMutation(api.chats.createChat)

  const handleRowClick = (bookingId: string) => {
    if (expandedRow === bookingId) {
      setExpandedRow(null)
    } else {
      setExpandedRow(bookingId)
    }
  }

  const handleViewDetails = (bookingId: string) => {
    router.push(`/home/services/${bookings[0].offer.serviceId}/bookings/${bookingId}`)
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

  const openSellerChat = async (customerId: string) => {
    const existingChat = useQuery(api.chats.getChatByUserIds, {
        customerId: customerId,
        sellerId: userId
    })
    try {
      let chatId = ''
      if (existingChat){
          chatId = existingChat._id
      } else {
          chatId = await newChat({ sellerId: userId, customerId: customerId, type: 'services' })
      }
      router.push(`/home/inbox?chatId=${chatId}`)
    } catch {
      toast({
        title: 'Failed to create chat',
        description: 'Please try again later',
        variant: 'destructive'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Chat</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <motion.tr
              key={booking.id}
              onClick={() => handleRowClick(booking.id)}
              initial={false}
              animate={{ backgroundColor: expandedRow === booking.id ? 'rgba(0, 0, 0, 0.05)' : 'transparent' }}
              transition={{ duration: 0.3 }}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>{booking.date.toLocaleDateString()}</TableCell>
              {booking.time && typeof booking.time === "object" && (
                <TableCell>{getTimeRange(booking.date, booking.time)}</TableCell>
              )}
              <TableCell>
                <Badge variant={
                    booking.status === 'PENDING' ? 'warning' :
                    booking.status === 'ACCEPTED' ? 'success' :
                    booking.status === 'CANCELLED' ? 'destructive' :
                    'default'
                    }>
                    {booking.status}
                </Badge>
              </TableCell>
              <TableCell>${booking.offer.price.toFixed(2)}</TableCell>
              <TableCell>{booking.location || "Default"}</TableCell>
              <TableCell>
                <Button onClick={() => openSellerChat(booking.customerId)} size="icon">
                  <MessageCircle className='h-4 w-4' />
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleViewDetails(booking.id)} size="sm">
                  View Details
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}