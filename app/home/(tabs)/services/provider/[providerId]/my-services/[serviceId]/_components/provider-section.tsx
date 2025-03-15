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

export const ProviderSection = ({ service, averageRating, reviews }: ServiceInfoProps) => {
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
            router.push(`/home/inbox?chatId=${chatId}`)
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
    <div className='flex flex-col gap-4 py-4 w-full mx-auto'>
        <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Meet Your Provider</h2>
                <div className="flex gap-6 p-3 rounded-lg border w-full cursor-pointer hover:bg-muted" onClick={() => router.push(`/home/services/provider/${service.provider.id}`)}>
                    <Avatar className="h-16 w-16 lg:h-28 lg:w-28">
                        <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} className="object-cover" />
                        <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'S'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 w-full">
                        <span className="flex items-center justify-start text-lg font-semibold gap-1">
                            {service.provider.name}
                            <VerifiedIcon className="h-4 w-4 md:h-6 md:w-6" />
                        </span>
                        <span className="text-sm text-muted-foreground">Since {service.provider.createdAt.toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            {service.provider.bio?.length! > 0 && (
                <div className="flex flex-col gap-3 p-4 rounded-lg border">
                    <h3 className="text-xl font-semibold">About</h3>
                    <p className="text-sm text-muted-foreground">{service.provider.bio}</p>
                </div>
            )}

            <Separator className="my-4" />
            <div className="grid grid-cols-8 gap-y-6 my-4">
                <Star className="h-8 w-8" />
                <div className="col-span-7 flex flex-col">
                    <h3 className="font-semibold">Trusted Reviews</h3>
                    <p className="text-sm text-muted-foreground">All review are verified and originate only from authentic users and customers for this service</p>
                </div>
                <Book className="h-8 w-8" />
                <div className="col-span-7 flex flex-col">
                    <h3 className="font-semibold">Efficient Bookings</h3>
                    <p className="text-sm text-muted-foreground">We offer a fast and efficient booking process. Schedule your service appointment in seconds</p>
                </div>
                <Calendar className="h-8 w-8" />
                <div className="col-span-7 flex flex-col">
                    <h3 className="font-semibold">Refund within 48 hours</h3>
                    <p className="text-sm text-muted-foreground">Get a full refund in case of cancellation or refusal within 48 hours</p>
                </div>
            </div>
    </div>
  )
}
