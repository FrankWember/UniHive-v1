"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { DollarSign, UserIcon, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Service, ServiceReview, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { submitReview, updateReview } from '@/actions/service-reviews'
import { useMediaQuery } from '@/hooks/use-media-query'

interface ServiceDetailsProps {
  service: Service & {
    provider: User
  }
  reviews: (ServiceReview & {
    reviewer: User
  })[]
}

interface ReviewsSectionProps {
  averageRating: number
  ratingCounts: Record<number, number>
  reviews: (ServiceReview & {
    reviewer: User
  })[]
  newReview: { rating: number, comment: string }
  setNewReview: (newReview: { rating: number, comment: string }) => void
  isSubmitting: boolean
  handleSubmitReview: () => void
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  averageRating,
  ratingCounts,
  reviews,
  newReview,
  setNewReview,
  isSubmitting,
  handleSubmitReview,
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-xl font-bold'>Reviews</h3>
      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </div>
      </div>
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <span className="flex text-sm w-14 text-muted-foreground">{rating} stars</span>
            <Progress value={((ratingCounts[rating] || 0) / reviews.length * 100) || 0} className="h-2 w-full" />
            <span className="w-12 text-sm text-muted-foreground text-right">
              {(((ratingCounts[rating] || 0) / reviews.length * 100).toFixed(0)) || 0}%
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4 mb-2">
                <Avatar>
                  <AvatarImage src={review.reviewer.image || undefined} alt={review.reviewer.name || 'Reviewer'} />
                  <AvatarFallback>{review.reviewer.name ? review.reviewer.name[0] : 'R'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{review.reviewer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Share your experience with this service</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                />
              ))}
            </div>
            <Textarea
              placeholder="Write your review here..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, reviews }) => {
  const my_review = reviews.find(review => review.reviewer.id === service.provider.id)
  const [newReview, setNewReview] = useState({rating: my_review?.rating || 0, comment: my_review?.comment || '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const [currentImgIndex, setCurrentImageIndex] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')

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


  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true)
      if (!user) {
        const callbackUrl = encodeURIComponent(`/home/services/${service.id}`)
        router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        return
      }
      if (!my_review) {
        await submitReview(service.id, user!.id!, newReview.rating, newReview.comment)
      } else {
        await updateReview(my_review.id, newReview.rating, newReview.comment)
      }
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMobile) {
    return (
      <div className='flex flex-col w-full max-w-6xl min-h-screen h-full px-10 overflow-hidden'>
        <div className='flex space-x-8'>
          {/* Service Images */}
          <div className='grid grid-cols-8 max-w-[60vw] gap-3 m-4'>
            <div className='col-span-1 flex flex-col gap-4'>
              {service.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`w-full rounded ${currentImgIndex === index ? 'ring ring-amber-500' : ''}`} 
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image 
                    src={image} 
                    alt={`Service Image ${index + 1}`} 
                    className='object-cover aspect-square rounded' 
                    width={200} 
                    height={200} 
                  />
                </div>
              ))}
            </div>
            <div className='col-span-7'>
              <Image 
                src={service.images[currentImgIndex]} 
                alt={`Service Image ${currentImgIndex + 1}`} 
                className='object-cover aspect-square rounded' 
                width={1500} 
                height={1500} 
              />
            </div>
          </div>

          {/* Service Details */}
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-2xl font-bold'>{service.name}</h2>
              <div className='flex items-center gap-2'>
                <span className='text-green-500 font-semibold text-xl'>$</span>
                <span className='font-semibold text-xl'>{(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}</span>
                {service.discount > 0 && (
                  <span className='text-sm text-muted-foreground line-through'>${service.price.toFixed(2)}</span>
                )}
                <Badge variant="secondary" className="ml-3">
                  {service.category}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
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
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-base">{service.provider.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary">Provider Verified</Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/home/services/${service.id}/book`}>
                  <Button>
                    Book Service
                  </Button>
                </Link>
                <Link href={`/home/services/provider/${service.providerId}`}>
                  <Button variant="outline">
                    Contact Provider
                  </Button>
                </Link>
              </div>
            </div>
            <Separator />
            <div className='flex flex-col gap-2'>
              <h3 className='text-xl font-bold'>Description</h3>
              <p className='text-base text-muted-foreground'>{service.description}</p>
            </div>
            <Separator />
            <ReviewsSection 
              averageRating={averageRating} 
              ratingCounts={ratingCounts} 
              reviews={reviews} 
              newReview={newReview} 
              setNewReview={setNewReview} 
              isSubmitting={isSubmitting} 
              handleSubmitReview={handleSubmitReview}
            />
          </div>
        </div>
      </div>
    )
  } else {
    // Mobile view
    return (
      <Card className="w-full min-w-[90vw] max-w-4xl mx-auto shadow-lg md:p-6 lg:p-8">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl md:text-3xl font-bold truncate">{service.name}</CardTitle>
              <div className="flex items-center mt-2">
                <span className='text-green-500 font-semibold text-xl'>$</span>
                <span className="font-semibold text-xl">{(service.price - (service.price * (service.discount || 0) / 100)).toFixed(2)}</span>
                {service.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">${service.price.toFixed(2)}</span>
                )}
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
            <Avatar className="h-16 w-16">
              <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'provider'} />
              <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'S'}</AvatarFallback>
            </Avatar>
          </div>
  
          <div className="flex space-x-2 items-end justify-between">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-base">{service.provider.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="secondary">Account Verified</Badge>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href={`/home/services/${service.id}/book`} className="block">
                <Button>Book This Service</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
  
        <CardContent className="space-y-6">
          {/* Images section */}
          <Carousel setApi={setApi} className="w-full mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {service.images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-square relative">
                    <Image
                      src={image}
                      alt={`${service.name} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-8 right-14 flex items-center gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
          <div className="py-1 text-center text-sm text-muted-foreground">
            Image {current} of {count}
          </div>
  
          <Separator />
  
          {/* Tabs section */}
          <Tabs defaultValue='description'>
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className='my-4'>
              <div>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="">
              <ReviewsSection 
                averageRating={averageRating} 
                ratingCounts={ratingCounts} 
                reviews={reviews} 
                newReview={newReview} 
                setNewReview={setNewReview} 
                isSubmitting={isSubmitting} 
                handleSubmitReview={handleSubmitReview}
              />
            </TabsContent>
          </Tabs>
          
          
          <Separator />
          <div className="flex gap-3">
            <Link href={`/home/services/${service.id}/book`} className="block">
              <Button>Book This Service</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }
}