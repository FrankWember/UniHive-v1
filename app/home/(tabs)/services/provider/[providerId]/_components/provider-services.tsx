import React from 'react'
import { getProviderServices } from '@/utils/data/services'
import { ServiceCard } from '../../../_components/service-card'

interface ProviderServicesProps {
  providerId: string
}

export const ProviderServices: React.FC<ProviderServicesProps> = async ({ providerId }) => {
  const services = await getProviderServices(providerId)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Services Offered</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}