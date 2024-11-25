import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ServiceDetails } from './_components/service-details'
import { getServiceById } from '@/utils/data/services'
import ServiceOptions from './_components/service-options'
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/back-button'
import { getServiceReviews } from '@/utils/data/services'

const ServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)
  const reviews = await getServiceReviews(params.serviceId)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold truncate">{service.name}</h1>
        </div>
        <ServiceOptions service={service} />
      </div>

      {/* Content */}
      <div className="flex flex-col mx-auto px-4 md:px-10 lg:px-20 mt-28 pb-24">
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <ServiceDetails service={service} reviews={reviews}/>
        </Suspense>
      </div>
    </div>
  )
}

export default ServicePage