import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProviderDetails } from './_components/provider-details'
import { ProviderServices } from './_components/provider-services'
import { getProviderById } from '@/utils/data/services'
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/back-button'
import type { Metadata, ResolvingMetadata } from 'next'
import { APP_URL } from '@/constants/paths'
import { SideMenu } from '../../_components/side-menu'

type Props = {
  params: Promise<{ providerId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const providerId = (await params).providerId
    const provider = await getProviderById(providerId)

    if (!provider) {
      return {
        title: 'Provider not found',
        description: 'The Provider you are looking for does not exist.',
      }
    }
  
    return {
      openGraph: {
        title: provider.name || provider.email,
        description: provider.bio!,
        images: [provider.image!],
        creators: [`@${provider.name || provider.email}`],
        url: `${APP_URL}/home/products/providers${provider.id}`
      },
      twitter: {
        card: 'summary_large_image',
        title: provider.name || provider.email,
        description: provider.bio!,
        images: [provider.image!],
        creator: `@${provider.name || provider.email}`,
        site: `${APP_URL}/home/products/providers/${provider.id}`
      }
    }
  } catch (error) {
    return {
      title: 'Provider not found',
      description: 'The Provider you are looking for does not exist.',
    }
  }
}

const ProviderPage = async ({ params }: { params: { providerId: string } }) => {
  const provider = await getProviderById(params.providerId)

  if (!provider) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen h-full max-w-screen w-full m-0 p-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 h-16 w-full border-b py-2 px-6 mt-8 md:mt-0">
        <div className="flex justify-start items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold truncate">{provider.name}</h1>
        </div>
        <SideMenu />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-3 md:px-8 md:mx-auto py-10 mb-20">
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