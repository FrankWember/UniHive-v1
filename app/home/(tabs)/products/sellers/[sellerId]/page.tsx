import { notFound } from 'next/navigation'
import { SellerProfile } from './_components/seller-profile'
import { SellerProducts } from './_components/seller-products'
import { getSellerById } from '@/utils/data/products'
import { BackButton } from '@/components/back-button'
import type { Metadata, ResolvingMetadata } from 'next'
import { APP_URL } from '@/constants/paths'

export async function generateMetadata(
  { params, parent } : { params: { sellerId: string }; parent: ResolvingMetadata }
) {
  try {
    const seller = await getSellerById(params.sellerId)

    if (!seller) {
      return {
        title: 'Seller not found',
        description: 'The Seller you are looking for does not exist.',
      }
    }
  
    return {
      openGraph: {
        title: seller.name,
        description: seller.bio,
        images: [seller.image],
        creators: [`@${seller.name || seller.email}`],
        url: `${APP_URL}/home/products/sellers${seller.id}`
      },
      twitter: {
        card: 'summary_large_image',
        title: seller.name,
        description: seller.bio,
        images: [seller.image],
        creator: `@${seller.name || seller.email}`,
        site: `${APP_URL}/home/products/sellers/${seller.id}`
      }
    }
  } catch (error) {
    return {
      title: 'Seller not found',
      description: 'The Seller you are looking for does not exist.',
    }
  }
}

export default async function SellerPage({ params }: { params: { sellerId: string } }) {
  const seller = await getSellerById(params.sellerId)

  if (!seller) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">{seller.name}&apos;s Shop</h1>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-3 md:px-8 md:mx-auto py-10 my-20">
        <SellerProfile seller={seller} />
        <SellerProducts seller={seller} />
      </div>
    </div>
  )
}