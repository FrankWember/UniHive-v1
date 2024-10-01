import React from 'react'
import { ServiceCard } from '@/app/home/(tabs)/services/_components/service-card'
import { getProviderServices } from '@/actions/services'

interface ProviderServicesProps {
  providerId: string
}

export const ProviderServices: React.FC<ProviderServicesProps> = async ({ providerId }) => {
  const services = await getProviderServices(providerId)

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Services Offered</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}