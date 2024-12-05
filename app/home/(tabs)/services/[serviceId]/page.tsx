import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ServiceDetails } from './_components/service-details'
import { getServiceById } from '@/utils/data/services'
import ServiceOptions from './_components/service-options'
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


const ServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await getServiceById(params.serviceId)
  const reviews = await getServiceReviews(params.serviceId)
  const user = await currentUser()

  if (!service) {
    notFound()
  }

  return (
    <ServicesProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <div className="flex justify-start items-center gap-3">
            <BackButton />
            <Link href="/home/services">
              <Image src="/Unihive.svg" alt="logo" width={40} height={40} className="rounded-md border" />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
              <SearchBar />
              {user?(
                <Link href={`/home/services/cart`}>
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </Link>
              ):(
                <Link href={`/auth/sign-up`}>
                  <Button>
                    Join
                  </Button>
                </Link>
              )}
              <Link href={`/home/services/provider/${service.providerId}/chat`}>
                <Button variant="outline" size="icon">
                  <ChatBubbleIcon />
                </Button>
              </Link>
              <ServiceOptions service={service} />
          </div> 
        </div>

        {/* Content */}
        <div className="flex flex-col mt-[5.7rem] pb-24">
          <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
            <ServiceDetails service={service} reviews={reviews}/>
          </Suspense>
        </div>
      </div>
    </ServicesProvider>
  )
}

export default ServicePage