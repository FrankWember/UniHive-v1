"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { UserIcon, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Service, ServiceReview, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { submitReview, updateReview } from '@/actions/service-reviews'
import { useMediaQuery } from '@/hooks/use-media-query'
import { BeatLoader } from 'react-spinners'
import { ReviewsSection } from './review-section'

interface ServiceDetailsProps {
  service: Service & {
    provider: User & {
      services: ({
        customer: {
          id: string
        }
      })[]
    },
    bookings: ({
      customer: {
        image: string|null
      }
    })[]
  }
  reviews: (ServiceReview & {
    reviewer: User
  })[]
}



export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, reviews }) => {
  const my_review = reviews.find(review => review.reviewer.id === service.provider.id)
  const [newReview, setNewReview] = useState({rating: my_review?.rating || 0, comment: my_review?.comment || '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const [currentImgIndex, setCurrentImageIndex] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')
  let providerClientsLength = service.provider.services.length

  // Carousel stuff
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true)
      if (!user) {
        const callbackUrl = encodeURIComponent(`/home/services/${service.id}`)
        router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        return
      }
      if (!my_review) {
        await submitReview(service.id, user!.id!, newReview.rating, newReview.comment)
      } else {
        await updateReview(my_review.id, newReview.rating, newReview.comment)
      }
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
      router.refresh()
    }
  }

  

  if (!isMobile) {
    return (
      <div className='flex flex-col w-full max-w-7xl min-h-screen h-full px-10 overflow-hidden'>
        <div className='flex justify-between px-3 py-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home/services">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/home/services?category=${service.category[0]}`}>{service.category[0]}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{service.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge variant={service.isMobileService ? 'success' : 'secondary'}>
            {service.isMobileService ? 'Mobile Service' : 'In-House Service'}
          </Badge>          
        </div>
        <div className='flex space-x-8'>
          {/* Service Images */}
          <div className='flex flex-col max-w-[55vw] min-w-[50vw] gap-3 m-4'>
            <Carousel setApi={setApi} className="w-full mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {service.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-[28rem] relative">
                      <Image 
                        src={image} 
                        alt={`Service Image ${index + 1}`} 
                        className='object-cover rounded w-full' 
                        fill
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-8 right-14 flex items-center gap-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
            <div className='flex gap-4 justify start'>
              {service.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`rounded ${currentImgIndex === index ? 'ring ring-amber-500' : ''}`} 
                  onClick={() => {
                    api?.scrollTo(index);
                    setCurrentImageIndex(index);
                  }}
                >
                  <Image 
                    src={image} 
                    alt={`Service Image ${index + 1}`} 
                    className='object-cover aspect-square rounded' 
                    width={100} 
                    height={100} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Service Details */}
          <div className='flex flex-col gap-4 py-4 w-full'>
            <p className="text-2xl underline font-bold">{service.name}</p>
            <div className="flex gap-3 justify-between">
              <div className="flex gap-1">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} />
                  <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'S'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <span className="flex gap-1 items-center">
                    <span className="text-xl font-semibold">{service.provider.name}</span>
                    <span className="text-sm text-muted-foreground">({providerClientsLength} clients served)</span>
                  </span>
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
                      ({reviews.length})
                    </div>
                  </div>
                  <span className="text-base">{service.defaultLocation}</span>
                </div>
              </div>

              <div className='flex-col gap-2 p-1'>
                <div className="flex -space-x-4 overflow-hidden">
                  {service.bookings.slice(0, 7).map((booking, index) => (
                    <Avatar key={index} className="inline-block h-8 w-8">
                      <AvatarImage src={booking.customer.image!} alt="C" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm underline">{service.bookings.length} active customers</p>
              </div>
            </div>

            <div className="flex gap-4 justify-between">
              <div className="flex items-center mt-2">
                <span className='text-sm mr-4'>Starts at</span>
                <span className='text-green-500 font-semibold text-2xl'>$</span>
                <span className="font-semibold text-2xl mr-3">{(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}</span>
                {service.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">${service.price.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-end">
                <Link href={`/home/services/${service.id}/book`}>
                  <Button>Book</Button>
                </Link>
              </div>
            </div>

            <Separator className="my-8" />
  
            {/* Tabs section */}
            <div className="max-w-4xl">
              <ReviewsSection 
                  averageRating={averageRating} 
                  ratingCounts={ratingCounts} 
                  reviews={reviews} 
                  newReview={newReview} 
                  setNewReview={setNewReview} 
                  isSubmitting={isSubmitting} 
                  handleSubmitReview={handleSubmitReview}
                />
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // Mobile view
    return (
      <div className="w-full m-0 p-0">
        <div className="flex flex-col gap-8 p-0 m-0">
          {/* Images section */}
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {service.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative w-full">
                    <Image
                      src={image}
                      alt={`${service.name} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-b-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-8 right-14 flex items-center gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
          <div className="py-1 text-center text-sm text-muted-foreground">
            Image {current} of {count}
          </div>
  
          {/* Service Details */}
          <div className='flex flex-col gap-4 p-4 w-full'>
            <p className="text-2xl underline font-bold">{service.name}</p>
            <div className="flex gap-3 justify-between">
              <div className="flex gap-1">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} />
                  <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'S'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <span className="flex gap-1 items-center">
                    <span className="text-xl font-semibold">{service.provider.name}</span>
                    <span className="text-sm text-muted-foreground">({providerClientsLength} clients served)</span>
                  </span>
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
                      ({reviews.length})
                    </div>
                  </div>
                  <span className="text-base">{service.defaultLocation}</span>
                </div>
              </div>

              <div className='flex-col gap-2 p-1'>
                <div className="flex -space-x-4 overflow-hidden">
                  {service.bookings.slice(0, 7).map((booking, index) => (
                    <Avatar key={index} className="inline-block h-8 w-8">
                      <AvatarImage src={booking.customer.image!} alt="C" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm underline">{service.bookings.length} active customers</p>
              </div>
            </div>

            <div className="flex gap-4 justify-between">
              <div className="flex items-center mt-2">
                <span className='text-sm mr-4'>Starts at</span>
                <span className='text-green-500 font-semibold text-2xl'>$</span>
                <span className="font-semibold text-2xl mr-3">{(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}</span>
                {service.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">${service.price.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-end">
                <Link href={`/home/services/${service.id}/book`}>
                  <Button>Book</Button>
                </Link>
              </div>
            </div>

            <Separator className="my-8" />
  
            {/* Tabs section */}
            <div className="max-w-4xl">
              <ReviewsSection 
                  averageRating={averageRating} 
                  ratingCounts={ratingCounts} 
                  reviews={reviews} 
                  newReview={newReview} 
                  setNewReview={setNewReview} 
                  isSubmitting={isSubmitting} 
                  handleSubmitReview={handleSubmitReview}
                />
            </div>
          </div>
        </div>
      </div>
    )
  }
}