import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProviderDetails } from '@/app/home/(tabs)/services/provider/[providerId]/_components/provider-details'
import { ProviderServices } from '@/app/home/(tabs)/services/provider/[providerId]/_components/provider-services'
import { getProviderById } from '@/actions/services'

const ProviderPage = async ({ params }: { params: { providerId: string } }) => {
  const provider = await getProviderById(params.providerId)

  if (!provider) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">{provider.name}</h1>
      </div>

      {/* Content */}
      <div className="w-full mt-20 space-y-8">
        <Suspense fallback={<div>Loading provider details...</div>}>
          <ProviderDetails provider={{
            ...provider,
            name: provider.name ?? '',
            image: provider.image ?? undefined
          }} />
        </Suspense>
        <Suspense fallback={<div>Loading provider services...</div>}>
          <ProviderServices providerId={provider.id} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProviderPage