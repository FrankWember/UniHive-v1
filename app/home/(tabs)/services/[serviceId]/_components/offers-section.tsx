"use client"
import React from 'react'
import { Service, ServiceOffer } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface OfferCardProps {
    service: Service & {
        offers: ServiceOffer[]
    },
    userId: string|undefined
}

export const OffersSection = ({service, userId}: OfferCardProps) => {
    const router = useRouter()
    return (
        <Card className='shadow-md'>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                    Offers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[30rem]">
                    {service.offers.map((offer, index)=> (
                        <div key={index}  className="flex flex-col border-t py-4 px-1">
                            <div className='flex gap-4 justify-start items-center'>
                                <p className="text-xl">{offer.title}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className='flex items-center gap-4'>
                                    <span className="font-semibold"><span className="text-green-500">$</span>{offer.price.toFixed(2)}</span>
                                    <Badge className="my-2" variant="secondary">
                                        <Clock className="mr-2 h-4 w-4" /> {offer.duration} mins
                                    </Badge>
                                </div>
                                <Button className="mr-3" onClick={() => router.push(`/home/services/${service.id}/book/${offer.id}`)}>
                                    Book
                                </Button>
                            </div>
                        </div>
                    ))}
                    <ScrollBar />
                </ScrollArea>
                {userId && userId===service.providerId && (
                    <div className='flex flex-col justify-end gap-4 my-4'>
                        <Separator />
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="secondary" onClick={() => router.push(`/home/services/${service.id}/offers/add`)}>
                                Add an Offer
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
