import { notFound } from 'next/navigation'
import { ProductDetails } from './_components/product-details'
import { RelatedProducts } from './_components/related-products'
import { getProductById, getProductReviews } from '@/utils/data/products'
import { BackButton } from '@/components/back-button'
import { Separator } from '@/components/ui/separator'
import { ProductOptions } from './_components/product-options'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = (await params).productId
 
  const product = await getProductById(productId)

  if (!product) {
    return {
      title: 'Product not found',
    }
  }
 
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    }
  }
}

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProductById(params.productId)
  const reviews = await getProductReviews(params.productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start items-center gap-3">
          <BackButton />
          <h1 className="text-xl md:text-2xl font-bold max-w-[250px] truncate">{product.name}</h1>
        </div>
        <ProductOptions product={product} />
      </div>

      {/* Content */}
      <div className="flex flex-col mx-auto px-4 mt-28 pb-24 space-y-3">
        <ProductDetails product={product} reviews={reviews} />
        <Separator />
        <RelatedProducts productId={product.id} category={product.categories[0]} />
      </div>
    </div>
  )
}