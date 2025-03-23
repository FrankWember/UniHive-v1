"use client"
import React from 'react'
import { Separator } from './ui/separator'
import { BookingStatus, ServiceBooking, ServiceOffer, Service, User } from '@prisma/client'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { getTimeRange } from '@/utils/helpers/time'
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Spinner } from './icons/spinner'


type Booking = ServiceBooking & {
    offer: ServiceOffer & {
      service: Service
    }
    customer: User
  }

export const BookingCard = ({
    booking,
}:{
    booking: Booking,
}) => {
    const { toast } = useToast()
    const [creatingChat, setCreatingChat] = React.useState(false)
    const user = useCurrentUser()
    const isProvider = booking.offer.service.providerId === user?.id
    const newChat = useMutation(api.chats.createChat)
    const router = useRouter()

    const existingChat = useQuery(
        api.chats.getChatByUserIds, 
        user?.id && isProvider ? {
          customerId: booking.customer.id,
          sellerId: user.id
        } : user?.id && !isProvider ? {
          customerId: user.id,
          sellerId: booking.offer.service.providerId
        } : "skip"
      );

    const createChat = async () => {
        try {
            setCreatingChat(true)
            let chatId = ''
            if (!user) {
                const callbackUrl = encodeURIComponent(`/home/services/${booking.offer.service.id}`)
                router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
                return
            }
            if (existingChat){
                chatId = existingChat._id
            } else if (isProvider) {
                chatId = await newChat({ sellerId: user.id!, customerId: booking.customer.id, type: 'services' })
            } else {
                chatId = await newChat({ sellerId: booking.offer.service.providerId, customerId: user!.id!, type: 'services' })
            }
            router.push(`/home/inbox/${chatId}`)
        } catch {
            toast({
                title: 'Failed to create chat',
                description: 'Please try again later',
                variant: 'destructive'
            })
        } finally {
            setCreatingChat(false)
        }
    }

  return (
    <Card className="overflow-hidden">
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
        <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
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
                <div>
                    <div className="font-medium text-sm">{booking.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{booking.customer.email}</div>
                </div>
            </div>
            <div>
                <Button size="icon" onClick={createChat} disabled={creatingChat}>
                    {creatingChat ? <Spinner/> : <MessageCircle className="h-4 w-4" />}
                </Button>
            </div>
        </div>
        </CardContent>
    </Card>
  )
}
