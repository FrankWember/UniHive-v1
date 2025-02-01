import React from 'react'
import { Service, ServiceReview, User } from '@prisma/client'
import { ServiceCard } from '../../_components/service-card'

interface RelatedServicesSectionProps {
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

export const RelatedServicesSection = ({
  relatedServices
}: RelatedServicesSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">Related Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-6">
        {relatedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}
