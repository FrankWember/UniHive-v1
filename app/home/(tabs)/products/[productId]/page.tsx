import { notFound } from 'next/navigation'
import { ProductDetails } from './_components/product-details'
import { ProductActions } from './_components/product-actions'
import { RelatedProducts } from './_components/related-products'
import { getProductById } from '@/utils/data/products'

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProductById(params.productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductDetails product={product} />
        <ProductActions product={product} />
      </div>
      <RelatedProducts productId={product.id} category={product.categories[0]} />
    </div>
  )
}