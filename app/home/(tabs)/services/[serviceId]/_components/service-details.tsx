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
import { useCurrentUser } from '@/hooks/use-current-user'
import { ReviewsSection } from './review-section'
import { ServiceInfo } from './service-info'
import { ImagesSection } from './images-section'
import { useIsMobile } from '@/hooks/use-mobile'
import { OffersSection } from './offers-section'
import { RelatedServicesSection } from './related-services-section'
import { PortfolioSection } from './portfolio-section'
import { ProviderSection } from './provider-section'
import { calculateServiceReviewMetrics } from '@/utils/helpers/reviews'

interface ServiceDetailsProps {
  service: Service & {
    provider: User & {
      services: ({
        name: string,
        images: string[],
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
  const user = useCurrentUser()
  const isMobile = useIsMobile()

  const ratingMemo = React.useMemo(() => {
    const metrics = calculateServiceReviewMetrics(reviews)
    const average = metrics?.overall!
    const counts = metrics?.ratingCount!
    return { average, counts }
  }, [reviews])

  const { average: averageRating, counts: ratingCounts } = ratingMemo

  

  

  if (isMobile) {
    return (
      <div className="w-full m-0 p-0">
        <div className="flex flex-col gap-8 p-0 m-0">
          {/* Images */}
          <ImagesSection service={service} />  

          {/* Service Info */}
          <div className="mx-2">
            <ServiceInfo 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            />
          </div>
          
          <Separator className="my-2" />

          {/* Offers section */}
          <div className="mx-8">
            <OffersSection service={service} userId={user?.id} />
          </div>

          <Separator className="my-2" />

          {/* Offers section */}
          <div className="mx-4">
            <ProviderSection 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            />
          </div>

          <Separator className="my-4" />

          {/* Portfolio section */}
          <div className="mx-4">
            <PortfolioSection images={service.portfolio} providerId={service.providerId} />
          </div>

          <Separator className="my-2" />

          {/* Reviews section */}
          <div className="mx-8">
            <ReviewsSection 
              averageRating={averageRating} 
              ratingCounts={ratingCounts} 
              reviews={reviews}
              serviceId={service.id}
            />
          </div>

          <Separator className="my-2" />

          {/* Related Services section */}
          <div className="mx-8">
            <RelatedServicesSection relatedServices={relatedServices} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col gap-6 w-full max-w-[90rem] min-h-screen h-full justify-center mx-auto px-12 lg:px-20 py-4 overflow-hidden'>
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
            <ServiceInfo 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            /> 
            <ProviderSection 
              service={service}
              averageRating={averageRating}
              reviews={reviews}
            />
          </div>

          {/* Offers section */}
          <div className="flex flex-col gap-8 w-full px-4 mx-auto">
            <OffersSection service={service} userId={user?.id} />
            <PortfolioSection images={service.portfolio} providerId={service.providerId} />
          </div>
        </div>

        {/* Reviews section */}
        <div className="w-full px-4 mx-auto">
            <Separator className="my-4" />
            <ReviewsSection 
              averageRating={averageRating} 
              ratingCounts={ratingCounts} 
              reviews={reviews}
              serviceId={service.id}
            />
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
