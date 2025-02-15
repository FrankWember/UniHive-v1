import React from 'react'
import type { Metadata } from 'next'
import { GoogleMapsProvider } from '@/contexts/google-maps-context';

export const metadata: Metadata = {
  title: "Home",
  description: "Digitally empowered campus life. Enjoy your university experience!",
};


const RidesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleMapsProvider>{children}</GoogleMapsProvider>
  )
}

export default RidesLayout