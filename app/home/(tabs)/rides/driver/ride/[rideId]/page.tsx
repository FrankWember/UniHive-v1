"use client"

import { useRide } from '@/contexts/ride-context'
import { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import Map from '@/app/home/(tabs)/rides/_components/map'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { calculateDistance, getDistanceBetweenPoints } from '@/utils/helpers/distance'
import { useGoogleMaps } from '@/contexts/google-maps-context'
import { BASE_FARE, RATE_PER_KM, SURGE_MULTIPLIER } from "@/constants/pricing"
import { calculateRidePrice } from '@/utils/helpers/distance'
import { RideDrawer } from './_components/ride-drawer'

const page = () => {
    const params = useParams<{ rideId: Id<"rideRequests"> }>()
    const { rideId } = params
    const { google } = useGoogleMaps()
    const { activeRide, setActiveRideId, currentLocation } = useRide()
    const [ destination, setDestination ] = React.useState<google.maps.LatLngLiteral | null>(null)
    
    const updateDriverCurrentLocation = useMutation(api.driver.updateDriverCurrentLocation)
    const updateRideStatus = useMutation(api.rides.updateRideStatus)
    const updateRidePrice = useMutation(api.rides.updateRidePrice)

    // Make sure the ride is active
    useEffect(() => {
        if (!activeRide) {
            setActiveRideId(rideId)
        }
    }, [activeRide, rideId])

    // Set the destination based on the ride status
    useEffect(()=>{
        if (activeRide?.status === "ACCEPTED") {
            setDestination({
                lat: activeRide?.pickupLocation?.latitude!,
                lng: activeRide?.pickupLocation?.longitude!
            })
        } else if (activeRide?.status === "PICKED_UP") {
            setDestination({
                lat: activeRide?.dropoffLocation?.latitude!,
                lng: activeRide?.dropoffLocation?.longitude!
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

    // Update the price when the ride is completed
    useEffect(()=>{
        if (activeRide?.status === "COMPLETED") {
            const distance = calculateDistance({
                lat1: activeRide.pickupLocation.latitude,
                lon1: activeRide.pickupLocation.longitude,
                lat2: currentLocation?.lat!,
                lon2: currentLocation?.lng!,
            })
            updateRidePrice({
                rideId: activeRide?._id!,
                price: calculateRidePrice({
                    distanceKm: distance!,
                    baseFare: BASE_FARE,
                    ratePerKm: RATE_PER_KM,
                    surgeMultiplier: SURGE_MULTIPLIER,
                    }),
            })
        }
    }, [activeRide?.status, currentLocation])

    // Update the driver's current location when the ride is active
    useEffect(() => {
        updateDriverCurrentLocation({
            rideId: activeRide?._id!,
            driverId: activeRide?.driverId!,
            lat: currentLocation?.lat!,
            lon: currentLocation?.lng!
        })
    }, [activeRide?._id, currentLocation?.lat, currentLocation?.lng])

  return (
    <div className="flex flex-col h-full w-full">
        <div className="flex justify-between w-screen h-16 p-4 fixed top-0 left-0 z-20 border-b bg-transparent/60 backdrop-blur-sm">
            <h1 className="text-2xl font-bold">
                {activeRide?.status === "ACCEPTED" ? "Pickup your Passenger"
                    : activeRide?.status === "PICKED_UP" ? "Drive to the Destination"
                    : activeRide?.status === "COMPLETED" ? "Reached Destination"
                    : activeRide?.status === "PAID" ? "You have been paid."
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