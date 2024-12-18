"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Service, ServiceOffer, ServiceReview, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { submitReview, updateReview } from '@/actions/service-reviews'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ReviewsSection } from './review-section'
import { ServiceInfo } from './service-info'
import { Button } from '@/components/ui/button'

interface ServiceDetailsProps {
  service: Service & {
    provider: User & {
      services: ({
        offers: {
          bookings: ({
            customer: {
              id: string
            }
          })[]
        }[]
      })[]
    },
    offers: (ServiceOffer & {
      bookings: ({
        customer: {
          image: string|null
        }
      })[]
    })[],
  }
  reviews: (ServiceReview & {
    reviewer: User
  })[],
}



export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, reviews }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const [currentImgIndex, setCurrentImageIndex] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const my_review = reviews.find(review => review.reviewer.id === user?.id)
  const [newReview, setNewReview] = useState({rating: my_review?.rating || 0, comment: my_review?.comment || '' })

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
      <div className='flex flex-col w-full max-w-7xl min-h-screen h-full px-12 overflow-hidden'>
        <div className='flex w-full justify-between px-3 py-4'>
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
          {service.isMobileService && (
            <Badge variant='success'>
              Mobile Service
            </Badge>
          )}      
        </div>
        <div className='flex space-x-8'>
          {/* Service Images */}
          <div className='flex flex-col w-full gap-3 m-4'>
            <Carousel setApi={setApi} className="w-full mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {service.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full aspect-square relative">
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
                    width={80} 
                    height={80} 
                  />
                </div>
              ))}
            </div>

            <Separator className='my-8' />

            {/* Reviews section */}
            <div className="w-full px-4 mx-auto">
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

          {/* Service Info */}
          <div className='flex flex-col w-full mx-4'>
            <ServiceInfo 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            /> 
            <Separator className="my-4" />

            {/* Offers section */}
            <div className='flex flex-col gap-3'>
              {service.offers.map((offer, index)=> (
                  <div  key={index} className="flex flex-col border rounded-md p-3">
                    <p className="text-xl">{offer.title}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className='flex items-center gap-2'>
                        {offer.discount>0 && (<span className='text-muted-foreground line-through'>${offer.price}</span>)}
                        <span className="font-semibold">${(offer.price - (offer.price * offer.discount / 100)).toFixed(2)}</span>
                        {offer.discount>0 ? (
                          <Badge variant="success">
                            Save up to {offer.discount}%
                          </Badge>
                        ):(
                          <Badge variant="secondary">
                            No discount
                          </Badge>
                        )}
                      </div>
                      <Button className="mr-3" onClick={() => router.push(`/home/services/${service.id}/book/${offer.id}`)}>
                        Book
                      </Button>
                    </div>
                  </div>
              ))}
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
          <div className="flex flex-col gap-2">
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
          </div>
  
          {/* Service Info */}
          <div className="mx-4">
            <ServiceInfo 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            />
          </div>
          
          <Separator className="my-4" />

          {/* Offers section */}
          <div className='flex flex-col gap-3 mx-8'>
            <h1 className="text-3xl font-bold mb-4">Offers</h1>
            {service.offers.map((offer, index)=> (
                <div  key={index} className="flex flex-col border rounded-md p-3">
                  <p className="text-xl">{offer.title}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className='flex items-center gap-2'>
                      {offer.discount>0 && (<span className='text-muted-foreground line-through'>${offer.price}</span>)}
                      <span className="font-semibold">${(offer.price - (offer.price * offer.discount / 100)).toFixed(2)}</span>
                      {offer.discount>0 ? (
                        <Badge variant="success">
                          Save up to {offer.discount}%
                        </Badge>
                      ):(
                        <Badge variant="secondary">
                          No discount
                        </Badge>
                      )}
                    </div>
                    <Button className="mr-3" onClick={() => router.push(`/home/services/${service.id}/book/${offer.id}`)}>
                      Book
                    </Button>
                  </div>
                </div>
            ))}
          </div>

          <Separator className="my-4" />
  
          {/* Reviews section */}
          <div className="mx-8">
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
    )
  }
}