import { APP_URL } from '@/constants/paths'
import { Service } from '@prisma/client'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${APP_URL}/api/services`, {
    method: 'GET',
  })
  const services: Service[] = await response.json()

  return services.map((service) => ({
      url: `${APP_URL}/home/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
}