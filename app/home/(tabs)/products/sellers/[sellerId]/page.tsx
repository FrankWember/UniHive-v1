import { notFound } from 'next/navigation'
import { SellerProfile } from './_components/seller-profile'
import { SellerProducts } from './_components/seller-products'
import { getSellerById } from '@/utils/data/products'
import { BackButton } from '@/components/back-button'

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
      <div className="container mx-auto py-10 mt-16">
        <SellerProfile seller={seller} />
        <SellerProducts seller={seller} />
      </div>
    </div>
  )
}