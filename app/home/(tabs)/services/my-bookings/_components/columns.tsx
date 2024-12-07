"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ServiceBooking, ServiceOffer } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapIcon } from "lucide-react"

type Booking = ServiceBooking & {
  offer: ServiceOffer
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
      const time = [new Date(row.original.time[0]), new Date(row.original.time[1])]
      return `${time[0]} - ${time[1]}`
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