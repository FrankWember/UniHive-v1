import React from 'react'
import { ServiceCard } from '../../../_components/service-card'
import { Service, ServiceReview, User } from '@prisma/client'

interface ProviderServicesProps {
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

export const ProviderServices: React.FC<ProviderServicesProps> = async ({ services }) => {

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Services Offered</h2>
      <div className="grid grid-cols-2  lg:grid-cols-3 gap-6 md:overflow-y-auto md:max-h-[90vh]">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      {services.length === 0 && (
        <p className="text-center text-muted-foreground">This seller has no products yet.</p>
      )}
    </div>
  )
}