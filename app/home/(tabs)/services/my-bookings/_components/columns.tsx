"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BookedServices } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapIcon } from "lucide-react"

export const columns: ColumnDef<BookedServices>[] = [
  {
    accessorKey: "service.name",
    header: "Service",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      return new Date(row.getValue("startTime")).toLocaleString()
    },
  },
  {
    accessorKey: "stopTime",
    header: "End Time",
    cell: ({ row }) => {
      return new Date(row.getValue("stopTime")).toLocaleString()
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
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
          row.getValue("status") === 'pending' ? 'warning' :
          row.getValue("status") === 'agreed' ? 'info' :
          row.getValue("status") === 'paid' ? 'success' :
          row.getValue("status") === 'completed' ? 'success' :
          row.getValue("status") === 'canceled' ? 'destructive' :
          'default'
        }>
          {row.getValue("status")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      if (!location) return null

      const openInMaps = () => {
        // Google Maps URL that works across devices
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
        window.open(mapsUrl, '_blank')
      }

      return (
        <Button 
          variant="outline" 
          size="icon"
          onClick={openInMaps}
          title={location}
        >
          <MapIcon className="h-4 w-4" />
        </Button>
      )
    }
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