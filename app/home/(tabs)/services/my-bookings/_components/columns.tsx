"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ServiceBooking, ServiceOffer } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapIcon } from "lucide-react"
import { JsonValue } from "@prisma/client/runtime/library"
import { parseBookingTime } from "@/utils/helpers/availability"

type Booking = ServiceBooking & {
  offer: ServiceOffer
}

const getTimeRange = (time: JsonValue) => {
  const { startTime, endTime } = parseBookingTime(time) ?? {}
  const startTimeString = startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
  const endTimeString = endTime ? new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
  return `${startTimeString} - ${endTimeString}`
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
      return getTimeRange(row.original.time)
    },
  },
  {
    accessorKey: "offer.price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("offer.price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
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
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button asChild>
          <Link href={`/home/services/my-bookings/${row.original.id}`}>
            View
          </Link>
        </Button>
      )
    },
  },
]