import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ServiceDetails } from './_components/service-details'
import { ServiceActions } from './_components/service-actions'
import { getServiceById } from '@/actions/services'
import { Button } from "@/components/ui/button"
import { PersonIcon } from "@radix-ui/react-icons"

const ServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">{service.name}</h1>
        <div className="flex items-center space-x-4">
          <Link href={`/home/services/provider/${service.providerId}`}>
            <Button variant="outline">
              <PersonIcon className="mr-2 h-4 w-4" />
              View Provider
            </Button>
          </Link>
          <ServiceActions serviceId={service.id} providerId={service.providerId} />
        </div>
      </div>

      {/* Content */}
      <div className="w-full mt-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ServiceDetails service={service} />
        </Suspense>
      </div>
    </div>
  )
}

export default ServicePage