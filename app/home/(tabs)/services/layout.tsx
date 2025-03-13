import { ServicesProvider } from '@/contexts/services-context'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Services",
    openGraph: {
      title: "DormBiz Services",
      description: "Bring your services to life with DormBiz Services",
      images: ["https://m4bzgt0vjx.ufs.sh/f/nYBT8PFt8ZHfMUoWNQlvYm2rFdR45xgNI7D1thwaiZzufosb"]
    },
    twitter: {
      title: "DormBiz Services",
      description: "Bring your services to life with DormBiz Services",
      card: "summary_large_image",
      images: ["https://m4bzgt0vjx.ufs.sh/f/nYBT8PFt8ZHfMUoWNQlvYm2rFdR45xgNI7D1thwaiZzufosb"]
    }
  };

const ServicesLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <ServicesProvider>
        {children}
    </ServicesProvider>
  )
}

export default ServicesLayout