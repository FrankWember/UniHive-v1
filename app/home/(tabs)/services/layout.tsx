import { ServicesProvider } from '@/contexts/services-context'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Unihive | Services",
    description: "Bring your Campus Services to the next level with Unihive.",
  };

const ServicesLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <ServicesProvider>
        {children}
    </ServicesProvider>
  )
}

export default ServicesLayout