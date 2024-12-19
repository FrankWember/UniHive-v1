"use client"
import React from 'react'
import { Service, ServiceOffer } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

interface OfferCardProps {
    service: Service & {
        offers: ServiceOffer[]
    }
}

export const OffersSection = ({service}: OfferCardProps) => {
    const router = useRouter()
    return (
        <div className='flex flex-col gap-3'>
            <h1 className="text-2xl font-semibold">Offers</h1>
            {service.offers.map((offer, index)=> (
                <div key={index}  className="flex flex-col border rounded-md p-4">
                    <div className='flex gap-4 justify-start items-center'>
                        <p className="text-xl underline">{offer.title}</p>
                        <Badge className="my-2" variant="secondary">
                            <Clock className="mr-2 h-4 w-4" /> {offer.duration} mins
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <div className='flex items-center gap-2'>
                            {offer.discount>0 && (<span className='text-muted-foreground line-through'>${offer.price}</span>)}
                            <span className="font-semibold">${(offer.price - (offer.price * offer.discount / 100)).toFixed(2)}</span>
                            {offer.discount>0 ? (
                            <Badge variant="success">
                                Save up to {offer.discount}%
                            </Badge>
                            ):(
                            <Badge variant="outline">
                                No discount
                            </Badge>
                            )}
                        </div>
                        <Button className="mr-3" onClick={() => router.push(`/home/services/${service.id}/book/${offer.id}`)}>
                            Book
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
