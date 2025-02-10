"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Service, ServiceReview, User } from '@prisma/client'
import Link from 'next/link'
import { Star, Heart } from 'lucide-react'
import { Share1Icon } from '@radix-ui/react-icons'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { calculateServiceReviewMetrics } from '@/utils/helpers/reviews'
import { parseAvailability, getClosestSlot, getClosestDayOfTheWeekAvailable } from '@/utils/helpers/availability'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { likeService } from '@/actions/services'
import { Spinner } from '@/components/icons/spinner'
import { useRouter } from 'next/navigation'
import { APP_URL } from '@/constants/paths'

type ServiceProps = {
  service: Service & { 
    reviews: ServiceReview[], 
    provider: User,
    offers: ({
      bookings: ({
        customer: {
          image: string|null
        }
      })[]
    })[]
  }
}

export const ServiceCard: React.FC<ServiceProps> = ({ service }) => {
  const { toast } = useToast()
  const router = useRouter()
  const user = useCurrentUser()
  const [isLiked, setIsLiked] = React.useState(false)
  const [isSharing, setIsSharing] = React.useState(false)
  const [isLiking, setIsLiking] = React.useState(false)
  const averageRating = calculateServiceReviewMetrics(service.reviews)?.overall!
  const availability = parseAvailability(service.availability)
  
  const closestDay = getClosestDayOfTheWeekAvailable(availability!)

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

  return (
      <div className="flex flex-col rounded-md p-2 gap-2 text-sm overflow-hidden" onClick={() => router.push(`/home/services/${service.id}`)}>
        <div className="relative h-56 w-full">
          <Image
            src={service.images[0]}
            alt={service.name}
            fill
            className="object-cover rounded-md"
          />
          {service.isMobileService && (
            <Badge className="absolute top-2 right-2 text-xs h-4" variant='success'>
              Mobile
            </Badge>
          )}
        </div>
        <div className="flex justify-between px-1">
          <div className="flex flex-col gap-[0.15rem] md:gap-1">
            <h2 className="text-[0.8rem] md:text-[1rem] font-semibold truncate w-[6rem] md:w-[10rem]">{service.name}</h2>
            <span className="text-xs">
              From <span className="text-green-500 text-sm">$</span>{service.price}
            </span>
            <span className="text-[0.4rem] md:text-xs max-w-[7rem] truncate">Available {closestDay}</span>
            <span className="text-[0.4rem] md:text-xs text-muted-foreground max-w-[6rem] truncate">{service.defaultLocation}</span>
          </div>
          <div className="relative flex flex-col items-end justify-between gap-2">
            <div className="flex items-center gap-2">
              <Star className="fill-foreground h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm font-bold">{(averageRating || 0).toFixed(1)}</span>
            </div>
            <div className="flex justify-end absolute bottom-[1.5rem] z-20" onClick={(e)=>e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="p-1" onClick={handleLike} disabled={isLiking}>
                  {isLiking ? <Spinner /> : <Heart className={`h-2 w-2 md:h-4 md:w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />}
              </Button> 
              <Button variant="ghost" size="icon" className="p-1" onClick={share} disabled={isSharing}>
                  {isSharing ? <Spinner /> : <Share1Icon className="h-2 w-2 md:h-4 md:w-4" />}
              </Button>
            </div>
            <div className='flex flex-col gap-1'>
              {/* <div className="flex -space-x-4 overflow-hidden">
                {customerList.length > 0 && customerList.slice(0, 7).map((booking, index) => (
                    <Avatar key={index} className="inline-block h-8 w-8">
                        <AvatarImage src={booking.customer.image!} alt="C" className="object-cover" />
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                ))}
              </div> */}
              <p className="text-[0.4rem] md:text-xs underline ml-3">{customerList.length} active customers</p>
            </div>
          </div>
        </div>
      </div>
  )
}