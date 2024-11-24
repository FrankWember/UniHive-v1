import { notFound } from 'next/navigation'
import { ProductDetails } from './_components/product-details'
import { RelatedProducts } from './_components/related-products'
import { getProductById } from '@/utils/data/products'
import { BackButton } from '@/components/back-button'
import { Separator } from '@/components/ui/separator'
import ProductOptions from './_components/product-options'

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProductById(params.productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold truncate">{product.name}</h1>
          <ProductOptions product={product} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col mx-auto px-4 md:px-10 lg:px-20 mt-28 pb-24 space-y-3">
        <ProductDetails product={product} />
        <Separator />
        <RelatedProducts productId={product.id} category={product.categories[0]} />
      </div>
    </div>
  )
}