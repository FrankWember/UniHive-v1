import { getRelatedProducts } from '@/utils/data/products'
import { ProductCard } from '../../_components/product-card'

interface RelatedProductsProps {
  productId: string
  category: string
}

export async function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(productId, category)

  if (relatedProducts.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-lg text-muted-foreground mb-4">No related products found.</h2>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}