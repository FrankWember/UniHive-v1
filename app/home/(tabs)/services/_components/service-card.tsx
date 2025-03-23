"use client"

import React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Service, ServiceReview, User } from "@prisma/client"
import { Star, Heart } from "lucide-react"
import { Share1Icon } from "@radix-ui/react-icons"
import { calculateServiceReviewMetrics } from "@/utils/helpers/reviews"
import { parseAvailability, getClosestDayOfTheWeekAvailable } from "@/utils/helpers/availability"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"
import { likeService } from "@/actions/services"
import { Spinner } from "@/components/icons/spinner"
import { useRouter } from "next/navigation"
import { APP_URL } from "@/constants/paths"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type ServiceProps = {
  service: Service & {
    reviews: ServiceReview[]
    provider: User
    offers: {
      bookings: {
        customer: {
          image: string | null
        }
      }[]
    }[]
  },
  url?: string | undefined
}

export const ServiceCard: React.FC<ServiceProps> = ({ service, url }) => {
  const { toast } = useToast()
  const router = useRouter()
  const user = useCurrentUser()
  const [isLiked, setIsLiked] = React.useState(false)
  const [isLiking, setIsLiking] = React.useState(false)
  const [isSharing, setIsSharing] = React.useState(false)
  const averageRating = calculateServiceReviewMetrics(service.reviews)?.overall!
  const availability = parseAvailability(service.availability)
  const closestDay = getClosestDayOfTheWeekAvailable(availability!)

  // Carousel stuff
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/services/${service.id}/favourites`)
        const data = await response.json()
        setIsLiked(data.isLiked)
      } catch (error) {
        console.error("Error fetching like status:", error)
        setIsLiked(false)
      }
    }

    if (user) {
      fetchLikeStatus()
    }
  }, [service.id, user])

  const handleLike = async () => {
    setIsLiking(true)
    if (!user) {
      toast({
        title: "Please log in to like a service",
        description: "You need to be logged in to like a service.",
      })
      return
    }
    const like = await likeService(service.id)
    setIsLiked(like)
    setIsLiking(false)
  }

  const customerList = React.useMemo(() => {
    let list: { customer: { image: string | null } }[] = []
    service.offers.forEach((offer) => {
      list = list.concat(offer.bookings)
    })
    return list
  }, [service.offers])

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
          console.error("Error sharing:", error)
        }
      } else {
        // Share to WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`
        window.open(whatsappUrl, "_blank")

        navigator.clipboard.writeText(fullMessage)
        toast({
          title: "Copied to clipboard",
          description: "The link has been copied to your clipboard",
        })
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      toast({
        title: "Failed to copy to clipboard",
        description: "Please try again later",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      className="relative flex flex-col rounded-md p-2 gap-2 text-sm overflow-hidden cursor-pointer max-w-[22rem]"
      onClick={(e) => {
        const target = e.target as HTMLElement
        // Don't navigate if the click is on or inside a carousel button or the like button
        if (!target.closest("[data-carousel-button]") && !target.closest("button")) {
          if (url) router.push(url)
          else router.push(`/home/services/${service.id}`)
        }
      }}
    >    
      <div className="relative w-full">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {service.images.map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={1}>
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="absolute hidden sm:block top-1/2 left-6 z-20 border" data-carousel-button />
          <CarouselNext className="absolute hidden sm:block top-1/2 right-6 z-20 border" data-carousel-button /> */}
          <div className="absolute bottom-6 left-0 right-0 flex w-full items-center justify-center gap-1">
            {service.images.map((image, idx)=>(
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full bg-white/70 border-gray-800 cursor-pointer ${idx === current-1 ? "bg-white h-3 w-3" : ""}`} 
                onClick={() => setCurrent(idx)}
                data-carousel-button
                />
            ))}
          </div>
        </Carousel>
      </div>
      <div className="absolute w-full top-3 left-0 right-0 flex justify-between items-center gap-2 px-6 z-20">
        {service.isMobileService ? (
            <Badge className="bg-white text-black dark:bg-black dark:text-white">
              Mobile
            </Badge>
          ):(
            <div></div>
          )}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            handleLike()
          }}
          disabled={isLiking}
        >
          {isLiking ? <Spinner /> : <Heart className={`h-4 w-4 md:h-6 md:w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />}
        </Button>
      </div>
      <div className="flex justify-between px-2">
        <div className="flex flex-col gap-[0.15rem] md:gap-[0.7rem]">
          <p className="text-[1rem] font-semibold truncate w-[15rem] md:w-[12rem]">{service.name}</p>
          <span className="text-sm">
            Starts At <span className="text-green-500 text-sm">$</span>
            {service.price}
          </span>
          {/* <span className="text-[0.4rem] md:text-xs max-w-[7rem] truncate">Available {closestDay}</span> */}
          <span className="text-xs text-muted-foreground max-w-[8rem] truncate">{service.defaultLocation}</span>
        </div>
        <div className="relative flex flex-col items-end justify-between gap-2 max-w-[6rem]">
          <div className="flex items-center gap-2">
            <Star className="fill-foreground h-4 w-4" />
            <span className="text-xs md:text-sm font-bold">{(averageRating || 0).toFixed(1)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[0.58rem] underline">{customerList.length} active customers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

