import React from 'react'
import { Separator } from './ui/separator'
import { BookingStatus } from '@prisma/client'
import { Badge } from './ui/badge'

export const BookingCard = ({
    title,
    dayOfTheWeek,
    dayOfTheMonth,
    startTime,
    endTime,
    location,
    price,
    status
}:{
    title: string,
    dayOfTheWeek: string,
    dayOfTheMonth: string,
    startTime: string,
    endTime: string,
    location: string,
    price: number,
    status: BookingStatus
}) => {
  return (
    <div className='flex gap-2 p-4 rounded-md w-full border justify-between'>
        <div className='flex flex-col gap-1 font-semibold text-lg items-center'>
            <span>{dayOfTheWeek}</span>
            <span>{dayOfTheMonth}</span>
        </div>
        <Separator orientation='vertical' />
        <div className='flex flex-col gap-1'>
            <div className='flex justify-between'>
                <p className='text-sm font-semibold'>{title}</p>
                <span className='text-lg font-bold'>${price}</span>
            </div>
            <div className='flex justify-between text-xs text-muted-foreground gap-4'>
                <span>{location}</span>
                <span>{startTime} - {endTime}</span>
            </div>
            <div className='flex justify-end'>
                <Badge 
                    variant={
                        status === "PENDING"
                          ? "warning"
                          : status === "ACCEPTED"
                            ? "success"
                            : status === "CANCELLED"
                              ? "secondary"
                              : status === "REJECTED"
                                ? "destructive"
                                : "default"
                    }>
                        {status}
                </Badge>
            </div>
        </div>
    </div>
  )
}
