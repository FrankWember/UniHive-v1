"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { SearchDestination } from './search-destination'

const Map = dynamic(() => import('./map'), { ssr: false })

export function RidesHome() {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [])

  const handleDestinationSet = (lat: number, lon: number) => {
    setDestination([lat, lon])
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow relative z-0">
        {currentLocation && (
          <Map center={currentLocation} destination={destination!} />
        )}
      </div>
      <div className="p-4 z-20">
        <SearchDestination onDestinationSet={handleDestinationSet} />
      </div>
    </div>
  )
}