"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Book, BriefcaseBusiness, Calendar, Heart, MapPin, MessageCircle, Router, Star } from 'lucide-react'
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
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { BeatLoader } from "react-spinners"
import { Spinner } from "@/components/icons/spinner"
import { APP_URL } from "@/constants/paths"

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
    const [isSharing, setIsSharing] = React.useState(false)
    const [isLiking, setIsLiking] = React.useState(false)
    const [creatingChat, setCreatingChat] = React.useState(false)

    const newChat = useMutation(api.chats.createChat)

    const existingChat = useQuery(
        api.chats.getChatByUserIds, 
        user?.id ? {
          customerId: user.id,
          sellerId: service.providerId
        } : "skip"
      );

    React.useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                setIsLiking(true)
                const response = await fetch(`/api/services/${service.id}/favourites`)
                const data = await response.json()
                setIsLiked(data.isLiked)
            } catch (error) {
                console.error('Error fetching like status:', error)
            } finally {
                setIsLiking(false)
            }
        }

        fetchLikeStatus()
    }, [service.id])

    const handleLike = async () => {
        setIsLiking(true)
        if (!user) {
            toast({
                title: 'Please log in to like a service',
                description: 'You need to be logged in to like a service.',
            })
            return
        }
        const like = await likeService(service.id)
        setIsLiked(like)
        setIsLiking(false)
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

    const share = async () => {
        try {
            const message = `${service.name} Service.\nAvailable from $${service.price}\nCheck it out here:`
            const serviceUrl = `${APP_URL}/home/services/${service.id}`
            setIsSharing(true)

            const fullMessage = `${message} ${serviceUrl}`

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: service.name, 
                        text: message, 
                        url: serviceUrl,
                    })
                } catch (error) {
                    console.error('Error sharing:', error)
                }
            } else {
                // Share to WhatsApp
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`
                window.open(whatsappUrl, '_blank')

                navigator.clipboard.writeText(fullMessage)
                toast({ 
                    title: 'Copied to clipboard', 
                    description: 'The link has been copied to your clipboard',
                })
            }


        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            toast({
                title: 'Failed to copy to clipboard',
                description: 'Please try again later',
            })
        } finally {
            setIsSharing(false)
        }
    }

    const createChat = async () => {
        try {
            setCreatingChat(true)
            let chatId = ''
            if (!user) {
                const callbackUrl = encodeURIComponent(`/home/services/${service.id}`)
                router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
                return
            }
            if (existingChat){
                chatId = existingChat._id
            } else {
                chatId = await newChat({ sellerId: service.provider.id, customerId: user!.id!, type: 'services' })
            }
            router.push(`/home/inbox/${chatId}`)
        } catch {
            toast({
                title: 'Failed to create chat',
                description: 'Please try again later',
                variant: 'destructive'
            })
        } finally {
            setCreatingChat(false)
        }
    }
    

    return (
        <div className='flex flex-col gap-4 py-4 w-full px-4 mx-auto'>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className="text-xl md:text-2xl font-semibold truncate">{service.name}</p>
                    <Button variant="outline" size="icon" onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Spinner /> : <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />}
                    </Button>
                    </div>
                <div className="flex justify-between">
                    <span className="flex items-end mt-2">
                        <span className='text-l mr-2'>Starts at</span>
                        <span className='text-green-500 font-semibold text-2xl'>$</span>
                        <span className="font-semibold text-2xl mr-3">
                            {service.price.toFixed(2)}
                        </span>
                    </span>
                    
                </div>
                <div className="flex justify-between gap-3">
                    <span className="flex items-center text-sm md:text-base truncate ">
                        <MapPin className="mr-1 h-4 w-4" />
                        {service.defaultLocation}
                    </span>
                    <div className="flex gap-3 justify-end">
                        <Button size="icon" onClick={createChat} disabled={creatingChat}>
                            {creatingChat ? <Spinner/> : <MessageCircle className="h-4 w-4" />}
                        </Button> 
                        <Button variant="outline" size="icon" onClick={share} disabled={isSharing}>
                            {isSharing ? <Spinner /> : <Share1Icon />}
                        </Button>        
                    </div>
                </div>
                
            </div>

            <Separator className="my-4" />
            <div className="flex w-full">
                <WeeklyAvailabilityCalendar availability={service.availability!} />
            </div>

            
            
        </div>
    )
}
