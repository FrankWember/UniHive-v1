import { APP_URL } from '@/constants/paths'
import { getAllServices } from '@/utils/data/services'
import { Service } from '@prisma/client'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getAllServices()

  return services.map((service) => ({
      url: `${APP_URL}/home/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
}