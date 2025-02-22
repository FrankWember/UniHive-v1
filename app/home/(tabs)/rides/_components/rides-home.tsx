"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { SearchDestination } from './search-destination'
import { Button } from '@/components/ui/button'
import { PanelRight } from 'lucide-react'
import { SideMenu } from './side-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import { RideDrawer } from './ride-drawer'
import { useRide } from '@/contexts/ride-context'



const Map = dynamic(() => import('./map'), { ssr: false })

export function RidesHome() {
  const { currentLocation } = useRide()
  const [ destination, setDestination ] = useState<google.maps.LatLngLiteral | null>(null)

  const user = useCurrentUser()

  const handleDestinationSet = (lat: number, lng: number) => {
    setDestination({ lat, lng })
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between w-screen h-16 p-4 fixed top-0 left-0 z-20 border-b bg-transparent/60 backdrop-blur-sm">
        <SearchDestination 
          destination={destination}
          onDestinationSet={handleDestinationSet} 
          currentLocation={currentLocation} 
          userId={user?.id!}
          />
        <SideMenu />
      </div>
      <div className="w-screen h-screen fixed top-0 left-0 -z-10">
        {currentLocation && (
          <Map center={currentLocation} destination={destination!} />
        )}
      </div>
      <RideDrawer />
    </div>
  )
}