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
]