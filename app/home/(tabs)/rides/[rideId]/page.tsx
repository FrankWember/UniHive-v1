"use client"

import { useRide } from '@/contexts/ride-context'
import { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const params = useParams<{ rideId: Id<"rideRequests"> }>()
    const { rideId } = params
    const { activeRide, setActiveRideId, currentLocation } = useRide()

    useEffect(() => {
        if (!activeRide) {
            setActiveRideId(rideId)
        }
    }, [activeRide, rideId])

  return (
    <div className="flex flex-col h-full w-full">
        <div className='p-0 m-0 h-screen w-screen -z-10'>
            Not yet ready
            {/* <Map center={currentLocation!} dropOff={activeRide?.pickupLocation!} /> */}
        </div>
    </div>
  )
}

export default page