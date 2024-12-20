import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ServiceDetails } from './_components/service-details'
import { getRelatedServices, getServiceById } from '@/utils/data/services'
import {ServiceOptions} from './_components/service-options'
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/back-button'
import { getServiceReviews } from '@/utils/data/services'
import { SearchBar } from '../_components/search-bar'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ServicesProvider } from '@/contexts/services-context'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import {ServiceHeader} from './_components/service-header'


const ServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)
  const reviews = await getServiceReviews(params.serviceId)
  const user = await currentUser()
  if (!service) {
    notFound()
  }

  const relatedServices = await getRelatedServices(service!)

  return (
    <ServicesProvider>
      <div className="flex flex-col min-h-screen w-full">
        <ServiceHeader user={user} service={service} />
        {/* Content */}
        <div className="flex flex-col md:mt-[5.7rem] pb-24">
          <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
            <ServiceDetails service={service} reviews={reviews} relatedServices={relatedServices} />
          </Suspense>
        </div>
      </div>
    </ServicesProvider>
  )
}

export default ServicePage