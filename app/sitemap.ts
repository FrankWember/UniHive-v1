import { APP_URL } from '@/constants/paths'
import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
        url: APP_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
    },
    {
        url: `${APP_URL}/home/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
    },
    {
        url: `${APP_URL}/home/products`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5
    },
    {
        url: `${APP_URL}/home/events`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5
    },
    {
        url: `${APP_URL}/auth/sign-in`,
        lastModified: new Date(),
        changeFrequency: 'never',
        priority: 0.5
    },
    {
        url: `${APP_URL}/auth/sign-up`,
        lastModified: new Date(),
        changeFrequency: 'never',        
        priority: 0.5
    }
  ]
}