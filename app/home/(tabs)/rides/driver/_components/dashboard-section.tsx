"use client"
import { RideRequest, useRide } from '@/contexts/ride-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BeatLoader } from 'react-spinners'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation } from 'lucide-react'
import React from 'react'
import { calculateDistance } from '@/utils/helpers/distance'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'

export const DashboardSection = () => {
    const router = useRouter()
    const { allClosestRides, currentLocation, getMyDriverAccount, setActiveRideId } = useRide()
    const user = useCurrentUser()
    const myAccount = getMyDriverAccount(user?.id!)

    const acceptRideRequest = useMutation(api.driver.acceptRideRequest)

    const [isLoading, setIsLoading] = React.useState(false)

    if (!myAccount || !myAccount._id) {
        return (
            <div className='flex w-full h-full flex-col items-center justify-center'>
                <Card>
                    <CardHeader>
                        <CardTitle>You don't have a driver account</CardTitle>
                        <CardDescription>Please sign up to become a driver.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={()=>router.push("/home/rides/driver/register")}>Register as Driver</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    function getFormattedDistance(lon: number, lat: number) {
        const distance = calculateDistance({
            lat1: currentLocation?.lat!,
            lon1: currentLocation?.lng!,
            lat2: lat,
            lon2: lon,
        })
        if (distance < 1000) {
            return `${distance.toFixed(0)} m`
        } else {
            return `${(distance / 1000).toFixed(1)} km`
        }
    }

    function acceptRide(ride: RideRequest) {
        setIsLoading(true)
        acceptRideRequest({
            rideRequestId: ride._id,
            driverId: myAccount?._id!
        }).then((result) => {
            if (result) {
                setActiveRideId(ride._id)
                router.push(`/home/rides/driver/ride/${ride._id}`)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }



  return (
    <div className='flex flex-col gap-4 pt-20'>
        <h1 className="text-4xl font-bold">Available Rides</h1>
        {allClosestRides?.filter(ride => ride.status === "AGREED" && !ride.driverId).map((ride) => (
            <div key={ride._id} className='flex gap-4 items-start p-3 rounded-lg border'>
                <Avatar>
                    <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-3'>
                    <span className='text-3xl font-bold'>${ride.price}</span>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <div className="space-y-1">
                                <div className="text-sm font-medium">{ride.pickupLocation.address}</div>
                                <div className="text-muted-foreground">{getFormattedDistance(ride.pickupLocation.longitude, ride.pickupLocation.latitude)} away</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Navigation className="h-3 w-3" />
                            <div className="space-y-1">
                                <div className="text-sm font-medium">{ride.dropoffLocation.address}</div>
                                <div className="text-muted-foreground">{getFormattedDistance(ride.dropoffLocation.longitude, ride.dropoffLocation.latitude)} away</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 justify-end'>
                        <Button onClick={()=>acceptRide(ride)} disabled={isLoading}>
                            {isLoading ? <BeatLoader /> : "Accept"}
                        </Button>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}
