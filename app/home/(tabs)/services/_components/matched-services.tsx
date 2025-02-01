import React, { Suspense } from 'react'
import { ServiceCard } from './service-card'
import { getMatchedServices } from '@/utils/data/services'
import { Skeleton } from '@/components/ui/skeleton'
import { ServicesContent } from './services-content'

interface MatchedServicesProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ServicesSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5 px-3 py-6">
    {[...Array(15)].map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>
    ))}
  </div>
)



export const MatchedServices: React.FC<MatchedServicesProps> = async ({ searchParams }) => {
  const services = await getMatchedServices(searchParams)

  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesContent services={services} />
    </Suspense>
  )
}