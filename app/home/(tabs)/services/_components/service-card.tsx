"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceBooking, Service, ServiceReview, User } from '@prisma/client'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CheckIcon } from '@radix-ui/react-icons'

type ServiceProps = {
  service: Service & { 
    reviews: ServiceReview[], 
    provider: User,
    bookings: ({
      customer: {
        image: string|null
      }
    })[]
  }
}

export const ServiceCard: React.FC<ServiceProps> = ({ service }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const callbackUrl = encodeURIComponent(`/home/services/${service.id}`)

  const averageRating = service.reviews.length > 0
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0

  return (
    <Link href={`/home/services/${service.id}`}>
      <div className="flex flex-col border-none rounded gap-2">
        <div className="relative h-56 w-full">
          <Image
            src={service.images[0]}
            alt={service.name}
            fill
            className="object-cover rounded"
          />
          {service.isMobileService && (
            <Badge className="absolute top-2 right-2 text-xs h-4" variant='success'>
              Mobile Service
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 justify-start">
            <Avatar className="h-6 w-6">
              <AvatarImage src={service.provider.image!} />
              <AvatarFallback>{service.provider.name![0] || service.provider.email[0]}</AvatarFallback>
            </Avatar>
            <svg className="h-4 w-4 fill-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
            </svg>
          </div>
          <div className="flex flex-col gap-[0.1rem] justify-start">
            <p className='text-sm underline'>{service.name}</p>
            <p className='space-x-1'>
              <span className='text-[0.5rem]' >Starts at</span>
              <span className='text-lg font-semibold'>${(service.price - (service.price * service.discount / 100)).toFixed(2)}</span>
            </p>
            <p className="text-[0.6rem] text-muted-foreground">
              {service.defaultLocation}, SUIE
            </p>
          </div>
          <div className='flex flex-col gap-1 justify-between'>
            <div className='flex-col gap-1 p-[0.2rem]'>
              <div className="flex -space-x-3 overflow-hidden">
                {service.bookings.slice(0, 7).map((booking, index) => (
                  <Avatar key={index} className="inline-block h-6 w-6">
                    <AvatarImage src={booking.customer.image!} alt="C" />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-[0.6rem] underline">{service.bookings.length} active customers</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold">{averageRating.toFixed(1)}</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-2 w-2 ${
                      star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs">
                ({service.reviews.length})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}