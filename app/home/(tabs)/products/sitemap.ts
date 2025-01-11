import { APP_URL } from '@/constants/paths'
import { getAllProducts } from '@/utils/data/products'
import { Product } from '@prisma/client'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts()

  return products.map((product) => ({
      url: `${APP_URL}/home/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
}