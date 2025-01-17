import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProviderDetails } from './_components/provider-details'
import { ProviderServices } from './_components/provider-services'
import { getProviderById } from '@/utils/data/services'
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/back-button'

const ProviderPage = async ({ params }: { params: { providerId: string } }) => {
  const provider = await getProviderById(params.providerId)

  if (!provider) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-start gap-4 h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold truncate">{provider.name}</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-3 md:px-8 md:mx-auto py-10 my-20">
        <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
          <ProviderDetails provider={provider} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
          <ProviderServices services={provider.services} products={provider.products} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProviderPage