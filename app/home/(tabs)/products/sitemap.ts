import { APP_URL } from '@/constants/paths'
import { Product } from '@prisma/client'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${APP_URL}/api/products`, {
    method: 'GET',
  })
  const products: Product[] = await response.json()

  return products.map((product) => ({
      url: `${APP_URL}/home/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
}