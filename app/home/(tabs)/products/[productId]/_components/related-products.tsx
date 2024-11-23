import { getRelatedProducts } from '@/utils/data/products'
import { ProductCard } from '../../_components/product-card'

interface RelatedProductsProps {
  productId: string
  category: string
}

export async function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(category)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}