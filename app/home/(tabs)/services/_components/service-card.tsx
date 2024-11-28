"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Service, ServiceReview } from '@prisma/client'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart } from 'lucide-react'

type ServiceProps = {
  service: Service & { reviews: ServiceReview[]}
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
      <Card className="flex flex-col bg-neutral-50 dark:bg-neutral-900 shadow-sm border-none">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={service.images[0]}
              alt={service.name}
              fill
              className="object-cover rounded"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-2">{service.name}</h3>
          <div className="flex items-center space-x-3">
            <div className="text-base font-semibold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              ({service.reviews.length})
            </div>
          </div>
          <div className="flex justify-between">
            {service.discount>0 ? (
              <div className='flex items-center space-x-2'>
                <p className="font-bold text-base">${(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}</p>
                <span className='text-muted-foreground line-through'>${service.price.toFixed(2)}</span>
              </div>
            ):(
              <p className="text-base font-semibold py-1">${service.price.toFixed(2)}</p>
            )}
            <Link href={`/home/services/${service.id}/book`} className="block">
              <Button disabled={isSubmitting} className="rounded-full bg-amber-500 hover:bg-amber-600" size="icon"><ShoppingCart className="w-4 h-4"/></Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}