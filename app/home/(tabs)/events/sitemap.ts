import { getAllEvents } from '@/actions/events'
import { APP_URL } from '@/constants/paths'
import { Event } from '@prisma/client'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getAllEvents()

  return events.map((event) => ({
      url: `${APP_URL}/home/events/${event.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
}