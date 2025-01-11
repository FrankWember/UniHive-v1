import { APP_URL } from '@/constants/paths'
import { Event } from '@prisma/client'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${APP_URL}/api/events`, {
    method: 'GET',
  })
  const events: Event[] = await response.json()

  return events.map((event) => ({
      url: `${APP_URL}/home/events/${event.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
}