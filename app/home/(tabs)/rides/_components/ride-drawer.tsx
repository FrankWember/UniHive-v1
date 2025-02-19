"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { CarTaxiFront } from 'lucide-react'
import { useRide } from '@/contexts/ride-context'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export const RideDrawer = () => {
    const { activeRide, driver } = useRide()

    return (
        <div className={`${activeRide ? "" : "hidden"} flex flex-col gap-4 justify-between h-[45vh] w-full fixed bottom-0 bg-muted/60 backdrop-blur-sm p-4 pb-24 rounded-t-lg`}>
            <div className='flex justify-center'>
                <div className="h-3 w-[50vw] bg-muted rounded-full" />
            </div>
            <div className='flex flex-col gap-4'>
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={driver?.carImages[0]} alt={driver?.userId} />
                        <AvatarFallback>D</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <CarTaxiFront className='h-5 w-5' />
                            <span className='text-sm font-bold'>{driver?.carBrand || "N/A"}</span>
                        </div>
                        <span className='text-sm font-bold'>{driver?.carModel || "N/A"}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className='text-3xl font-bold'>${activeRide?.price}</span>
            </div>
            <div className='flex gap-3 justify-end mb-10'>
                <Button variant='outline'>
                    Cancel
                </Button>
                <Button>
                    Accept
                </Button>
            </div>
        </div>
    )
}
