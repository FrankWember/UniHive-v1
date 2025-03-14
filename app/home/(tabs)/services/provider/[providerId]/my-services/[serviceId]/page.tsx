import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ServiceDetails } from '@/app/home/(tabs)/services/[serviceId]/_components/service-details'
import { getRelatedServices, getServiceById } from '@/utils/data/services'
import { Skeleton } from "@/components/ui/skeleton"
import { getServiceReviews } from '@/utils/data/services'
import { currentUser } from '@/lib/auth'
import { ServiceHeader } from '@/app/home/(tabs)/services/[serviceId]/_components/service-header'


const ServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)
  const reviews = await getServiceReviews(params.serviceId)
  const user = await currentUser()
  if (!service) {
    notFound()
  }

  const relatedServices = await getRelatedServices(service!)

  return (
    <div className="flex flex-col min-h-screen w-full">
      <ServiceHeader user={user} service={service} />
      {/* Content */}
      <div className="flex flex-col md:mt-[5.7rem] pb-24">
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <ServiceDetails service={service} reviews={reviews} relatedServices={relatedServices} />
        </Suspense>
      </div>
    </div>
  )
}

export default ServicePage