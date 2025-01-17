import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Star } from 'lucide-react'
import { VerifiedIcon } from '@/components/icons/verified-icon'
import { calculateServiceReviewMetrics } from '@/utils/helpers/reviews'
import { User, Service, ServiceReview } from '@prisma/client'
import { Table, TableRow, TableCell, TableHead, TableCaption, TableBody } from "@/components/ui/table"

interface ProviderDetailsProps {
  provider: User & {
    services: ( Service & { 
      reviews: ServiceReview[], 
      provider: User,
      offers: ({
        bookings: ({
          customer: {
            image: string|null
          }
        })[]
      })[]
    })[]
  }
}

export const ProviderDetails: React.FC<ProviderDetailsProps> = ({ provider }) => {

  const ratingMetrics = React.useMemo(() => {
    let overall = calculateServiceReviewMetrics(provider.services.flatMap(service => service.reviews))
    return {
      accuracy: overall?.accuracy || 0,
      communication: overall?.communication || 0,
      checkIn: overall?.checkIn || 0,
      cleanliness: overall?.cleanliness || 0,
      location: overall?.location || 0,
      value: overall?.value || 0,
      overall: overall?.overall || 0,
    }
  }, [provider.services])

  const customers = provider.services.flatMap(service => service.offers).flatMap(offer => offer.bookings).map(booking => booking.customer)

  return (
    <Card className="mb-6 w-full h-fit">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="h-36 w-36 md:h-48 md:w-48">
          <AvatarImage src={provider.image!} alt={provider.name || 'Provider'} className="object-cover" />
          <AvatarFallback>{provider.name![0] || 'P'}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-3xl flex items-center">{provider.name}<VerifiedIcon className="ml-3 h-8 w-8" /></CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            Joined {new Date(provider.createdAt).toLocaleDateString()}
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            {customers.slice(0, 7).map((customer, index) => (
              <Avatar key={index} className="inline-block h-6 w-6">
                <AvatarImage src={customer.image!} alt="C" className="object-cover" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
            ))}
            <p className="ml-6">
              {customers.length} active customers
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Seller Ratings</TableCaption>
          <TableBody>
            <TableRow>
              <TableHead>Overall</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.overall}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Check In</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.checkIn}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.location}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Communication</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.communication}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Accuracy</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.accuracy}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Cleanliness</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.cleanliness}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.value}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}