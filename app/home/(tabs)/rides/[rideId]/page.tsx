"use client"

import { useRide } from '@/contexts/ride-context'
import { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import Map from '@/app/home/(tabs)/rides/_components/map'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { RideDrawer } from './_components/ride-drawer'

const page = () => {
    const params = useParams<{ rideId: Id<"rideRequests"> }>()
    const { rideId } = params
    const { activeRide, setActiveRideId, currentLocation } = useRide()
    const [ destination, setDestination ] = React.useState<google.maps.LatLngLiteral | null>(null)
    const updateRideStatus = useMutation(api.rides.updateRideStatus)

    // Make sure the ride is active
    useEffect(() => {
        if (!activeRide) {
            setActiveRideId(rideId)
        }
    }, [activeRide, rideId])

    // Set the destination based on the ride status
    useEffect(()=>{
        if (activeRide?.status === "PICKED_UP") {
            setDestination({
                lat: activeRide?.dropoffLocation?.latitude!,
                lng: activeRide?.dropoffLocation?.longitude!
            })
        } else {
            setDestination({
                lat: activeRide?.pickupLocation?.latitude!,
                lng: activeRide?.pickupLocation?.longitude!
            })
        }
    }, [activeRide?.status])

    // Update the ride status when the driver arrives at the destination
    useEffect(()=>{
        if (
            activeRide?.dropoffLocation.latitude === currentLocation?.lat && 
            activeRide?.dropoffLocation.longitude === currentLocation?.lng &&
            activeRide?.status !== "PAID" &&
            activeRide?.status !== "COMPLETED"
        ) {
            updateRideStatus({
                rideId: activeRide?._id!,
                status: "COMPLETED"
            })
        }
    })

  return (
    <div className="flex flex-col h-full w-full">
        <div className="flex justify-between w-screen h-16 p-4 fixed top-0 left-0 z-20 border-b bg-transparent/60 backdrop-blur-sm">
            <h1 className="text-2xl font-bold">
                {activeRide?.status === "ACCEPTED" ? "Waiting for Pickup"
                    : activeRide?.status === "PICKED_UP" ? "Driving to the Destination"
                    : activeRide?.status === "COMPLETED" ? "Reached Destination"
                    : activeRide?.status === "PAID" ? "Ride Paid."
                    : "Ride In Progress"
                }
            </h1>
        </div>
        <div className='p-0 m-0 h-screen w-screen'>
            <Map center={currentLocation!} destination={destination!} />
        </div>
        <RideDrawer />
    </div>
  )
}

export default page