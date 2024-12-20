"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { Heart, MapPin, MessageCircle, Router, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Service, ServiceOffer, User } from '@prisma/client'
import { VerifiedIcon } from "@/components/icons/verified-icon"
import { Badge } from "@/components/ui/badge"
import { WeeklyAvailabilityCalendar } from "./weekly-availability-calendar"
import { useToast } from "@/hooks/use-toast"
import { Share1Icon } from "@radix-ui/react-icons"
import { useCurrentUser } from "@/hooks/use-current-user"
import React from "react"
import { isFavouriteService, likeService } from "@/actions/services"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface ServiceInfoProps {
    service: Service & {
        provider: User & {
            services: ({
                offers: {
                    bookings: ({
                        customer: {
                            id: string
                        }
                    })[]
                }[]
            })[]
        },
        offers: {
            bookings: ({
                customer: {
                    image: string | null;
                }
            })[]
        }[],
    };
    averageRating: number;
    reviews: any[];
}

export const ServiceInfo = ({ service, averageRating, reviews }: ServiceInfoProps) => {
    const { toast } = useToast()
    const user = useCurrentUser()
    const router = useRouter()
    const [isLiked, setIsLiked] = React.useState(false)

    const newChat = useMutation(api.chats.createChat)
    const existingChat = useQuery(api.chats.getChatByUserIds, {
        customerId: user?.id!,
        sellerId: service.providerId
    })

    React.useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await fetch(`/api/services/${service.id}/favourites`)
                const data = await response.json()
                setIsLiked(data.isLiked)
            } catch (error) {
                console.error('Error fetching like status:', error)
            }
        }

        fetchLikeStatus()
    }, [service.id])

    const handleLike = async () => {
        if (!user) {
            toast({
                title: 'Please log in to like a service',
                description: 'You need to be logged in to like a service.',
            })
            return
        }
        const like = await likeService(service.id)
        setIsLiked(like)
    }
    
    let customerList: ({customer: {image: string|null}})[] = []
    service.offers.map(offer=>{
        customerList.concat(offer.bookings)
    })

    let providerClientsLength = 0
    service.provider.services.forEach(providerService => {
        providerService.offers.forEach(offer=>{
            providerClientsLength+=offer.bookings.length
        })
    })

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text)
            toast({ 
                title: 'Copied to clipboard', 
                description: 'The link has been copied to your clipboard',
            })
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            toast({
                title: 'Failed to copy to clipboard',
                description: 'Please try again later',
            })
        }
    }

    const createChat = async () => {
        try {
            let chatId = ''
            if (existingChat){
                chatId = existingChat._id
            } else {
                chatId = await newChat({ sellerId: service.provider.id, customerId: user!.id!, type: 'services' })
            }
            router.push(`/home/inbox?chatId=${chatId}`)
        } catch {
            toast({
                title: 'Failed to create chat',
                description: 'Please try again later',
                variant: 'destructive'
            })
        }
    }
    

    return (
        <div className='flex flex-col gap-4 py-4 w-full px-4 mx-auto'>
            <p className="text-2xl underline font-bold">{service.name}</p>
            <div className="flex items-center space-x-3">
                <div className="text-xl font-semibold">{averageRating.toFixed(1)}</div>
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-6 w-6 ${
                                star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <div className="text-sm text-muted-foreground">
                    ({reviews.length})
                </div>
                {service.isMobileService && (
                    <Badge variant='success' className="ml-8">
                        Mobile
                    </Badge>
                )}    
            </div>
            <div className="flex items-center mt-2">
                <span className='text-[0.6rem] md:text-sm mr-4'>Starts at</span>
                <span className='text-green-500 font-semibold text-2xl'>$</span>
                <span className="font-semibold text-2xl mr-3">
                    {(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}
                </span>
                {service.discount > 0 && (
                    <span className="text-base text-muted-foreground line-through">
                        ${service.price.toFixed(2)}
                    </span>
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Provider</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex gap-3 items-center">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} className="object-cover" />
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
                        <Badge variant="secondary" className="text-[0.6rem]">
                            {providerClientsLength} clients served
                        </Badge>
                        <Button className="flex text-[0.6rem] h-6 mr-3" variant="secondary">
                            <MapPin className="mr-1 h-4 w-4" />
                            {service.defaultLocation}
                        </Button>
                    </div>
                    <div className='flex gap-2 p-1 justify-between'>
                        <div className="flex -space-x-4 overflow-hidden">
                            {customerList.slice(0, 7).map((booking, index) => (
                                <Avatar key={index} className="inline-block h-8 w-8">
                                    <AvatarImage src={booking.customer.image!} alt="C" className="object-cover" />
                                    <AvatarFallback>C</AvatarFallback>
                                </Avatar>
                            ))}
                            <p className="text-xs underline ml-3">{customerList.length} active customers</p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" size="icon" onClick={()=>copyToClipboard(`https://unihive-app.vercel.app/home/services/${service.id}`)}>
                                <Share1Icon />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleLike}>
                                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button> 
                            <Button size="icon" onClick={createChat}>
                                <MessageCircle className="h-4 w-4" />
                            </Button>        
                        </div>
                    </div>
                </CardContent>
                
            </Card>

            <div className="flex w-full">
                <WeeklyAvailabilityCalendar availability={service.availability!} />
            </div>
        </div>
    )
}
