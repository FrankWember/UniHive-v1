"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ServiceBooking, ServiceOffer, Service } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { JsonValue } from "@prisma/client/runtime/library"
import { parseBookingTime } from "@/utils/helpers/availability"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from "@/hooks/use-toast"
import { BeatLoader } from "react-spinners"


type Booking = ServiceBooking & {
  offer: ServiceOffer & {
    service: Service
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

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "offer.title",
    header: "Service",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString()
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return getTimeRange(row.original.date, row.original.time)
    },
  },
  {
    accessorKey: "offer",
    header: "Price",
    cell: ({ row }) => {
      const amount = row.original.offer.price.toFixed(2)
      return `$ ${amount}`
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={
          row.getValue("status") === 'PENDING' ? 'warning' :
          row.getValue("status") === 'ACCEPTED' ? 'success' :
          row.getValue("status") === 'CANCELLED' ? 'destructive' :
          'default'
        }>
          {row.getValue("status")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location"
  },
  {
    header: "Chat",
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const router = useRouter()
      const user = useCurrentUser()
      const userId = user?.id!
      const newChat = useMutation(api.chats.createChat)
      const { toast } = useToast()

      const openCustomerChat = async () => {
        setLoading(true)
        const existingChat = useQuery(api.chats.getChatByUserIds, {
            customerId: userId,
            sellerId: row.original.offer.service.providerId
        })
        try {
          let chatId = ''
          if (existingChat){
              chatId = existingChat._id
          } else {
              chatId = await newChat({ sellerId: row.original.offer.service.providerId, customerId: userId, type: 'services' })
          }
          router.push(`/home/inbox?chatId=${chatId}`)
        } catch {
          toast({
            title: 'Failed to create chat',
            description: 'Please try again later',
            variant: 'destructive'
          })
        } finally {
          setLoading(false)
        }
      }

      return (
        <Button onClick={openCustomerChat} size="icon">
          {loading ? <BeatLoader /> : <MessageCircle className='h-4 w-4' />}
        </Button>
      )
    }
  },
]