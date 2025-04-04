"use client"

import React, { act } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRide } from "@/contexts/ride-context"
import { CarTaxiFront, Navigation } from 'lucide-react'
import { calculateDistance } from '@/utils/helpers/distance'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export const RideDrawer = () => {
    const { activeRide, setActiveRideId, currentLocation } = useRide()
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const updateRideStatus = useMutation(api.rides.updateRideStatus)

    function getFormattedDistance(lon: number, lat: number) {
        const distance = calculateDistance({
            lat1: currentLocation?.lat!,
            lon1: currentLocation?.lng!,
            lat2: lat,
            lon2: lon,
        })
        const distanceInMiles = distance * 0.000621371; // Convert meters to miles
        if (distanceInMiles < 1) {
            return `${(distanceInMiles * 5280).toFixed(0)} ft`; // Convert miles to feet
        } else {
            return `${distanceInMiles.toFixed(1)} mi`; // Return miles
        }
    }

    React.useEffect(()=>{
        if (
            activeRide?.status === "ACCEPTED" &&
            activeRide?.driverCurrentLocation?.latitude === currentLocation?.lat &&
            activeRide?.driverCurrentLocation?.longitude === currentLocation?.lng
        ) {
            updateRideStatus({
                rideId: activeRide?._id!,
                status: "PICKED_UP"
            })
        }
    }, [activeRide?.status, currentLocation, activeRide?.driverCurrentLocation])

    function payForTheRide() {
        setIsLoading(true)
        try {
            // TODO: Implement payment logic
            updateRideStatus({
                rideId: activeRide?._id!,
                status: "PAID"
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to pay for the ride",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    function ExitRide () {
        setActiveRideId(null)
        router.push("/home/rides")
    }

    return (
        <div className='flex flex-col gap-4 justify-between max-h-[40vh] w-full fixed bottom-0 bg-transparent/65 backdrop-blur-sm p-4 pb-24 rounded-t-lg z-20'>
            <div className='flex justify-center'>
                <div className="h-3 w-[50vw] bg-muted rounded-full" />
            </div>
            {activeRide?.status === "ACCEPTED" ? (
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.estimatedPrice}</span>
                    <div className="flex items-center gap-2">
                        <CarTaxiFront className="h-6 w-6" />
                        <div className="space-y-1">
                            <div className="text-sm font-medium">{activeRide?.pickupLocation.address}</div>
                            <div className="text-muted-foreground">{getFormattedDistance(activeRide?.driverCurrentLocation?.longitude! || 0, activeRide?.driverCurrentLocation?.latitude! || 0)} away</div>
                        </div>
                    </div>
                </div>
            ) : activeRide?.status === "PICKED_UP" ? (
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.price}</span>
                    <div className="flex items-center gap-2">
                        <Navigation className="h-6 w-6" />
                        <div className="space-y-1">
                            <div className="text-sm font-medium">{activeRide?.dropoffLocation.address}</div>
                            <div className="text-muted-foreground">{getFormattedDistance(activeRide?.dropoffLocation.longitude!, activeRide?.pickupLocation.latitude!)} away</div>
                        </div>
                    </div>
                </div>
            ) : activeRide?.status === "COMPLETED" ? (
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.price}</span>
                    <p className='text-sm text-muted-foreground'>Signal your driver when to stop and pay the price above.</p>
                    <div className='flex items-center gap-2 justify-end'>
                        <Button onClick={payForTheRide}>
                            Pay
                        </Button>
                    </div>
                </div>
            ) : activeRide?.status === "PAID" ? (
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.price}</span>
                    <p className='text-sm text-muted-foreground'>Your ride has been paid. Thanks for using Dormbiz!</p>
                    <div className='flex items-center gap-2 justify-end'>
                        <Button onClick={ExitRide}>
                            Exit Ride
                        </Button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    <Skeleton className="h-10 w-full rounded" />
                    <div className='flex items-center gap-2'>
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-full rounded" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}