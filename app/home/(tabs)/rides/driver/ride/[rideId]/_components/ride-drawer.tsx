"use client"

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRide } from "@/contexts/ride-context"
import { Navigation } from 'lucide-react'
import { calculateDistance } from '@/utils/helpers/distance'

export const RideDrawer = () => {
    const { activeRide, currentLocation } = useRide()

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

    return (
        <div className='flex flex-col gap-4 justify-between max-h-[40vh] w-full fixed bottom-0 bg-transparent/65 backdrop-blur-sm p-4 pb-24 rounded-t-lg z-20'>
            <div className='flex justify-center'>
                <div className="h-3 w-[50vw] bg-muted rounded-full" />
            </div>
            {activeRide?.status === "ACCEPTED" ? (
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.price}</span>
                    <div className="flex items-center gap-2">
                        <Navigation className="h-6 w-6" />
                        <div className="space-y-1">
                            <div className="text-sm font-medium">{activeRide?.pickupLocation.address}</div>
                            <div className="text-muted-foreground">{getFormattedDistance(activeRide?.pickupLocation.longitude!, activeRide?.pickupLocation.latitude!)} away</div>
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
                    <p className='text-sm text-muted-foreground'>You have completed this ride. We are Waiting for your passenger to pay for this ride.</p>
                </div>
            ) : activeRide?.status === "PAID" ? (
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${activeRide?.price}</span>
                    <p className='text-sm text-muted-foreground'>Congratulations, the ride is paid and complete. Thanks for using Dormbiz!</p>
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
