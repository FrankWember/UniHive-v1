import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ServiceDetails } from './_components/service-details'
import { getRelatedServices, getServiceById } from '@/utils/data/services'
import { Skeleton } from "@/components/ui/skeleton"
import { getServiceReviews } from '@/utils/data/services'
import { currentUser } from '@/lib/auth'
import { ServiceHeader } from './_components/service-header'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ serviceId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const serviceId = (await params).serviceId
  
    const service = await getServiceById(serviceId)

    if (!service) {
      return {
        title: 'Service not found',
        description: "The Service you are looking for does not exist"
      }
    }

    const serviceDescription = `${service.name} is a ${service.category[0]} service provided by ${service.provider.name}. Available from ${service.price.toFixed(2)}. Book now!`
  
    return {
      title: service.name,
      description: serviceDescription,
      openGraph: {
        title: service.name,
        description: serviceDescription,
        images: service.images,
      },
      twitter: {
        card: 'summary_large_image',
        title: service.name,
        description: serviceDescription,
        images: service.images,
      }
    }
  } catch {
    return {
      title: 'Service not found',
      description: "The Service you are looking for does not exist"
    }
  }
}

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
      <div className="flex flex-col md:mt-[5.7rem] pb-16">
        <Suspense fallback={<Skeleton className="w-full h-[550px]" />}>
          <ServiceDetails service={service} reviews={reviews} relatedServices={relatedServices} />
        </Suspense>
      </div>
    </div>
  )
}

export default ServicePage
