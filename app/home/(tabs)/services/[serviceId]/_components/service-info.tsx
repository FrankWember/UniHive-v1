"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Service, ServiceOffer, User } from '@prisma/client'
import { VerifiedIcon } from "@/components/icons/verified-icon"
import { Badge } from "@/components/ui/badge"

interface ServiceInfoProps {
    service: Service & {
        provider: User & {
            services: ({
                bookings: ({
                    customer: {
                        id: string
                    }
                })[]
            })[]
        },
        bookings: ({
            customer: {
                image: string | null;
            }
        })[],
    };
    averageRating: number;
    reviews: any[];
}

export const ServiceInfo = ({ service, averageRating, reviews }: ServiceInfoProps) => {
    let providerClientsLength = 0
    service.provider.services.forEach(providerService => {
        providerClientsLength += providerService.bookings.length
    })

    return (
        <div className='flex flex-col gap-4 py-4 w-full px-4 mx-auto'>
            <p className="text-2xl underline font-bold">{service.name}</p>
            <div className="flex gap-3 justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-3 items-center">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} />
                            <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'S'}</AvatarFallback>
                        </Avatar>
                        <span className="flex gap-1 items-center h-16">
                            <span className="flex items-center justify-start text-lg font-semibold">
                                {service.provider.name}
                                <VerifiedIcon className="h-8 w-8" />
                            </span>
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="secondary" className="text-sm">
                            {providerClientsLength} clients served
                        </Badge>
                        <Button className="flex text-sm h-6 mr-3" variant="secondary">
                            <MapPin className="mr-1 h-4 w-4" />
                            {service.defaultLocation}
                        </Button>
                    </div>
                    <div className='flex gap-2 p-1'>
                        <div className="flex -space-x-4 overflow-hidden">
                            {service.bookings.slice(0, 7).map((booking, index) => (
                                <Avatar key={index} className="inline-block h-8 w-8">
                                    <AvatarImage src={booking.customer.image!} alt="C" />
                                    <AvatarFallback>C</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <p className="text-xs underline">{service.bookings.length} active customers</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-base font-semibold">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                        star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            ({reviews.length})
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 justify-between">
                <div className="flex items-center mt-2">
                    <span className='text-sm mr-4'>Starts at</span>
                    <span className='text-green-500 font-semibold text-3xl'>$</span>
                    <span className="font-semibold text-3xl mr-3">
                        {(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}
                    </span>
                    {service.discount > 0 && (
                        <span className="text-base text-muted-foreground line-through">
                            ${service.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
