"use client"

import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator'
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
import { ReviewsSection } from './review-section'
import { ServiceInfo } from './service-info'
import { ImagesSection } from './images-section'
import { useIsMobile } from '@/hooks/use-mobile'
import { OffersSection } from './offers-section'
import { RelatedServicesSection } from './related-services-section'

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

  relatedServices: (Service & { 
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



export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, reviews, relatedServices }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const isMobile = useIsMobile()
  const my_review = reviews.find(review => review.reviewer.id === user?.id)
  const [newReview, setNewReview] = useState({rating: my_review?.rating || 0, comment: my_review?.comment || '' })


  const ratingMemo = React.useMemo(() => {
    const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0
    const counts = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    return { average, counts }
  }, [reviews])

  const { average: averageRating, counts: ratingCounts } = ratingMemo

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

  

  if (isMobile) {
    return (
      <div className="w-full m-0 p-0">
        <div className="flex flex-col gap-8 p-0 m-0">
          {/* Images */}
          <ImagesSection service={service} />  

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
          <div className="mx-8">
            <OffersSection service={service} userId={user?.id} />
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

          <Separator className="my-4" />

          {/* Related Services section */}
          <div className="mx-8">
            <RelatedServicesSection relatedServices={relatedServices} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col gap-6 w-full max-w-7xl min-h-screen h-full justify-center mx-auto px-12 lg:px-20 py-8 overflow-hidden'>
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

        {/* Images */}
        <ImagesSection service={service} />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          
          {/* Service Info */}
          <div className="w-full px-4 mx-auto">
            <Separator className="my-4" />
            <ServiceInfo 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            /> 
          </div>

          {/* Offers section */}
          <div className="w-full px-4 mx-auto">
            <Separator className="my-4" />
            <OffersSection service={service} userId={user?.id} />
          </div>

          

          {/* Reviews section */}
          <div className="w-full px-4 mx-auto">
            <Separator className="my-4" />
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
        <Separator className='my-8' />

        {/* Related Services section */}
        <div className="w-full px-4 mx-auto">
          <RelatedServicesSection relatedServices={relatedServices} />
        </div>
      </div>
    )
  }
}