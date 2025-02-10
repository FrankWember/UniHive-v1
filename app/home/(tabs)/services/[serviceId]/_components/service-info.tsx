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

    let existingChat = undefined
    if (user && user.id && service.providerId) {
        existingChat = useQuery(api.chats.getChatByUserIds, {
            customerId: user.id,
            sellerId: service.providerId
        })
    }

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
        <div className='flex flex-col gap-4 py-4 w-full px-4 mx-auto'>
            <div className="flex flex-col gap-2">
                <p className="text-3xl font-semibold">{service.name}</p>
                {/* <div className="flex items-center space-x-2">
                    <Star
                        className={`h-6 w-6 text-yellow-500 fill-yellow-500`}
                    />
                    <span className="text-xl font-semibold">{averageRating}</span>
                    <div className="text-base text-muted-foreground underline">
                        #{reviews.length} reviews
                    </div>
                    {service.isMobileService && (
                        <Badge variant='success' className="ml-8">
                            Mobile
                        </Badge>
                    )}    
                </div> */}
                <span className="flex items-end mt-2">
                    <span className='text-sm md:text-sm mr-4'>Starts at</span>
                    <span className='text-green-500 font-semibold text-4xl'>$</span>
                    <span className="font-semibold text-4xl mr-3">
                        {service.price.toFixed(2)}
                    </span>
                </span>
                <div className="flex justify-between gap-3">
                    <Button className="flex items-center" variant="outline">
                        <MapPin className="mr-1 h-4 w-4" />
                        {service.defaultLocation}
                    </Button>
                    <div className="flex gap-3 justify-end">
                        <Button size="icon" onClick={createChat} disabled={creatingChat}>
                            {creatingChat ? <Spinner/> : <MessageCircle className="h-4 w-4" />}
                        </Button> 
                        <Button variant="outline" size="icon" onClick={share} disabled={isSharing}>
                            {isSharing ? <Spinner /> : <Share1Icon />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleLike} disabled={isLiking}>
                            {isLiking ? <Spinner /> : <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />}
                        </Button>        
                    </div>
                </div>
                
            </div>

            <Separator className="my-4" />
            <div className="flex w-full">
                <WeeklyAvailabilityCalendar availability={service.availability!} />
            </div>

            <Separator className="my-4" />
            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Meet Your Provider</h2>
                <div className="flex gap-6 p-3 rounded-lg border w-full">
                    <Avatar className="h-28 w-28">
                        <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} className="object-cover" />
                        <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'S'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 w-full">
                        <span className="flex items-center justify-start text-lg font-semibold gap-1">
                            {service.provider.name}
                            <VerifiedIcon className="h-6 w-6" />
                        </span>
                        <span className="text-sm text-muted-foreground">Since {service.provider.createdAt.toLocaleDateString()}</span>
                        <div className="flex justify-between w-full">
                            <span className="text-[0.6rem] md:text-xs lg:text-sm underline">{customerList.length} active customers</span>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" size='icon' onClick={() => router.push(`/home/services/provider/${service.provider.id}`)}>
                                    <BriefcaseBusiness />
                                </Button>
                                <Button size="icon" onClick={createChat} disabled={creatingChat}>
                                    {creatingChat ? <Spinner/> : <MessageCircle className="h-4 w-4" />}
                                </Button>        
                            </div>
                        </div>
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
