"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Service, ServiceReview, User } from '@prisma/client'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { VerifiedIcon } from '@/components/icons/verified-icon'
import { useIsMobile } from '@/hooks/use-mobile'

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
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 justify-start">
            <Avatar className="h-6 w-6">
              <AvatarImage src={service.provider.image!} />
              <AvatarFallback>{service.provider.name![0] || service.provider.email[0]}</AvatarFallback>
            </Avatar>
            <VerifiedIcon className='h-6 w-6'/>
          </div>
          <div className="flex flex-col gap-[0.1rem] justify-start">
            <p className='text-[0.75rem] md:text-[0.85rem] underline'>{service.name}</p>
            <p className='space-x-1'>
              <span className='text-[0.5rem]' >Starts at</span>
              <span className='text-base md:text-lg font-semibold'>${(service.price - (service.price * service.discount / 100)).toFixed(2)}</span>
            </p>

            <div className='flex gap-1 justify-start items-center'>
              <div className='flex flex-col gap-[0.1rem] justify-start'>
                <p className="text-[0.6rem] text-muted-foreground">
                  {service.defaultLocation}, SUIE
                </p>
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

              <div className='flex-col gap-1 p-[0.2rem]'>
                <div className="flex -space-x-3 overflow-hidden">
                  {service.bookings.slice(0, 7).map((booking, index) => (
                    <Avatar key={index} className="inline-block h-6 w-6">
                      <AvatarImage src={booking.customer.image!} alt="C" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-[0.4rem] md:text-[0.5rem] underline">{service.bookings.length} active customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}