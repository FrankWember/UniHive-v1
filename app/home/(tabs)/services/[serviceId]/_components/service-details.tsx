"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
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

interface ServiceDetailsProps {
  service: Service & {
    provider: User
  }
  reviews: (ServiceReview & {
    reviewer: User
  })[]
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, reviews }) => {
  const my_review = reviews.find(review => review.reviewer.id === service.provider.id)
  const [newReview, setNewReview] = useState({rating: my_review?.rating || 0, comment: my_review?.comment || '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const handleSubmitReview = async () => {
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
    router.push(`/home/services/${service.id}`)
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg md:p-6 lg:p-8">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">{service.name}</CardTitle>
            <CardDescription className="text-lg">
              <div className="flex items-center mt-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-2xl">{service.price.toFixed(2)}</span>
              </div>
            </CardDescription>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'Provider'} />
            <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'P'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{service.provider.name}</span>
          </div>
          <Badge variant="secondary">Account Verified</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {service.category.map((cat) => (
            <Badge key={cat} variant="outline" className="text-sm">
              {cat}
            </Badge>
          ))}
        </div>
        <Separator />
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{service.description}</p>
        </div>
        <Separator />
        <div className="flex flex-col justify-center px-8 md:px-0 pb-8">
          <h2 className="text-xl font-semibold mb-4">Service Images</h2>
          <Carousel className="w-full mx-auto">
            <CarouselContent>
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
        </div>
        <Separator />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Reviews</h2>
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
              <span className="text-sm w-12 text-muted-foreground">{rating} stars</span>
              <Progress value={((ratingCounts[rating] || 0) / reviews.length * 100) || 0} className="h-2 w-full" />
              <span className="w-12 text-sm text-muted-foreground text-right">
                {(((ratingCounts[rating] || 0) / reviews.length * 100).toFixed(0)) || 0}%
              </span>
            </div>
            ))}
          </div>
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
        <Separator />
        <Link href={`/home/services/${service.id}/book`} className="block">
          <Button>Book This Service</Button>
        </Link>
      </CardContent>
    </Card>
  )
}