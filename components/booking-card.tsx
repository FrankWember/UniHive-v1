"use client"
import React from 'react'
import { Separator } from './ui/separator'
import { BookingStatus, ServiceBooking, ServiceOffer, Service, User } from '@prisma/client'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { getTimeRange } from '@/utils/helpers/time'


type Booking = ServiceBooking & {
    offer: ServiceOffer & {
      service: Service
    }
    customer: User
  }

export const BookingCard = ({
    booking,
    onclick
}:{
    booking: Booking,
    onclick?: () => void
}) => {
  return (
    <Card className="overflow-hidden" onClick={onclick}>
        <div
        className={`h-1 ${
            booking.status === "ACCEPTED"
            ? "bg-green-500"
            : booking.status === "PENDING"
                ? "bg-yellow-500"
                : booking.status === "CANCELLED"
                ? "bg-red-500"
                : "bg-purple-500"
        }`}
        />
        <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
            <div className="font-medium">{booking.offer.service.name}</div>
            <Badge
                variant={
                    booking.status === "PENDING"
                    ? "warning"
                    : booking.status === "ACCEPTED"
                        ? "success"
                        : booking.status === "CANCELLED"
                        ? "secondary"
                        : booking.status === "REJECTED"
                            ? "destructive"
                            : "default"
                }
                >
                {booking.status}
            </Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
            {booking.offer.title} - ${booking.offer.price}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span>
            {format(new Date(booking.date), "MMM d, yyyy")} at{" "}
            {getTimeRange(booking.date, booking.time)}
            </span>
        </div>
        {booking.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{booking.location}</span>
            </div>
        )}
        <div className="mt-3 pt-3 border-t flex items-center gap-2">
            <div className="">
            {booking.customer.image ? (
                <div className="h-8 w-8 rounded-full overflow-hidden">
                <img
                    src={booking.customer.image || "/placeholder.svg"}
                    alt={booking.customer.name ?? booking.customer.email}
                    className="h-full w-full object-cover"
                />
                </div>
            ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                    {booking.customer.name?.charAt(0) ?? booking.customer.email?.charAt(0)}
                </span>
                </div>
            )}
            </div>
            <div>
            <div className="font-medium text-sm">{booking.customer.name}</div>
            <div className="text-xs text-muted-foreground">{booking.customer.email}</div>
            </div>
        </div>
        </CardContent>
    </Card>
  )
}
