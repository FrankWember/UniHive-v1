"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ServiceBooking, ServiceOffer } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BookingsTableProps {
  bookings: (ServiceBooking & {
    offer: ServiceOffer
  })[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

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
              <TableCell>{`${booking.time[0].toLocaleTimeString()} - ${booking.time[1].toLocaleTimeString()}`}</TableCell>
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