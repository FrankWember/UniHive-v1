"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRide } from '@/contexts/ride-context'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, Navigation } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { calculateDistance } from '@/utils/helpers/distance'
import { BeatLoader } from 'react-spinners'



export const RideDrawer = () => {
    const router = useRouter()
    const { activeRide, setActiveRideId, currentLocation } = useRide()

    const agreeRideRequest = useMutation(api.passenger.agreeToRideRequest)
    const cancelRideRequest = useMutation(api.passenger.cancelRideRequest)

    const [isLoading, setIsLoading] = React.useState(false)

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

    function agreeRide() {
        setIsLoading(true)
        if (activeRide) {
            agreeRideRequest({
                rideRequestId: activeRide._id
            }).then((result) => {
                if (result) {
                    router.push(`/home/rides/${activeRide._id}`)
                }
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    const cancelRide = () => {
        if (activeRide) {
            setIsLoading(true)
            cancelRideRequest({
                rideRequestId: activeRide._id
            }).then((result) => {
                if (result) {
                    setActiveRideId(null)
                    router.refresh()
                }
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <div className={`${activeRide ? "" : "hidden"} flex flex-col gap-4 justify-between max-h-[55vh] w-full fixed bottom-0 bg-transparent/65 backdrop-blur-sm p-4 pb-24 rounded-t-lg z-20`}>
            <div className='flex justify-center'>
                <div className="h-3 w-[50vw] bg-muted rounded-full" />
            </div>
            <div className='flex gap-4 items-start p-3'>
                <Avatar>
                    <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.price}</span>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <div className="space-y-1">
                                <div className="text-sm font-medium">{activeRide?.pickupLocation.address}</div>
                                <div className="text-muted-foreground">{getFormattedDistance(activeRide?.pickupLocation.longitude!, activeRide?.pickupLocation.latitude!)} away</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Navigation className="h-5 w-5" />
                            <div className="space-y-1">
                                <div className="text-sm font-medium">{activeRide?.dropoffLocation.address}</div>
                                <div className="text-muted-foreground">{getFormattedDistance(activeRide?.dropoffLocation.longitude!, activeRide?.dropoffLocation.latitude!)} away</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 justify-end'>
                        <Button variant="outline" onClick={cancelRide} disabled={isLoading}>
                            {isLoading ? <BeatLoader /> : "Cancel"}
                        </Button>
                        {activeRide?.status === "PENDING" && (
                            <Button onClick={agreeRide} disabled={isLoading}>
                                {isLoading ? <BeatLoader /> : "Accept"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
