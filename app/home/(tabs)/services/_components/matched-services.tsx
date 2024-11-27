import React from 'react'
import { ServiceCard } from './service-card'
import { getMatchedServices } from '@/utils/data/services'

interface MatchedServicesProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const MatchedServices: React.FC<MatchedServicesProps> = async ({ searchParams }) => {
  const services = await getMatchedServices(searchParams)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 p-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}