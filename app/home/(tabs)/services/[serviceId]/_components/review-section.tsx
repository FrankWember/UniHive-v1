"use client"

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageSquare, ChevronLeft, ChevronRight, Shield, ShieldCheck, MapPin, Key, SprayCan, MessagesSquare, CircleCheck, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ServiceReview, User } from '@prisma/client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ServiceReviewSchema, type ServiceReviewFormValues } from '@/constants/zod'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { submitReview, updateReview } from '@/actions/service-reviews'
import { BeatLoader } from 'react-spinners'
import { calculateServiceReviewMetrics } from '@/utils/helpers/reviews'


interface ReviewsSectionProps {
  averageRating: number
  ratingCounts: Record<number, number>
  reviews: (ServiceReview & {
    reviewer: User
  })[],
  serviceId: string
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  averageRating,
  ratingCounts,
  reviews,
  serviceId
}) => {

  // pagination stuff
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  
  const ratingMetrics = React.useMemo(() => {
    let overall = calculateServiceReviewMetrics(reviews)
    return {
      cleanliness: overall?.cleanliness || 0,
      communication: overall?.communication || 0,
      accuracy: overall?.accuracy || 0,
      checkIn: overall?.checkIn || 0,
      location: overall?.location || 0,
      value: overall?.value || 0,
      overall: overall?.overall || 0,
    }
  }, [reviews])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-16 py-8'>
      <div className='flex flex-col gap-6'>
        <div className="flex items-center justify-center space-x-4 w-full">
          <h2 className="text-8xl font-bold text-center">
            {averageRating || 0}
          </h2>
          <Star className="text-yellow-500 fill-yellow-500 h-20 w-20" />
        </div>
        <div className="space-y-2">
          <h3 className='text-xl font-semibold'>Overall Rating</h3>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <span className="flex text-sm min-w-16 text-muted-foreground">{rating} stars</span>
              <Progress value={((ratingCounts[rating] || 0) / reviews.length * 100) || 0} className="h-2 w-full" />
              <span className="w-12 text-sm text-muted-foreground text-right">
                {(((ratingCounts[rating] || 0) / reviews.length * 100).toFixed(0)) || 0}%
              </span>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-1 space-y-3 space-x-1'>
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center space-x-2">
              <SprayCan className="h-4 w-4" />
              <span>Cleanliness</span>
            </div>
            <span className='font-semibold'>{ratingMetrics.cleanliness}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center space-x-2">
              <MessagesSquare className="h-4 w-4" />
              <span>Communication</span>
            </div>
            <span className='font-semibold'>{ratingMetrics.communication}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center space-x-2">
              <CircleCheck className="h-4 w-4" />
              <span>Accuracy</span>
            </div>
            <span className='font-semibold'>{ratingMetrics.accuracy}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Ckeck In</span>
            </div>
            <span className='font-semibold'>{ratingMetrics.checkIn}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <span className='font-semibold'>{ratingMetrics.location}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Value</span>
            </div>
            <span className='font-semibold'>{ratingMetrics.value}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xl">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
            <ReviewDialog reviews={reviews} serviceId={serviceId} />
          </div>
        <div className="grid grid-cols-1 py-4 gap-4">
          {currentReviews.map((review) => (
            <div key={review.id} className='pt-6 border-t flex flex-col gap-1'>
              <div className="flex items-center space-x-4 mb-2">
                <Avatar>
                  <AvatarImage src={review.reviewer.image || undefined} alt={review.reviewer.name || 'Reviewer'} className='object-cover'/>
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
                      star <= ratingMetrics.overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}


const ReviewDialog = ({
  reviews, serviceId
}: {
  reviews: (
    ServiceReview & {
    reviewer: User
  })[], 
  serviceId: string
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const my_review = reviews.find(review => review.reviewer.id === user?.id)

  const form = useForm<ServiceReviewFormValues>({
    resolver: zodResolver(ServiceReviewSchema),
    defaultValues: {
      cleanliness: my_review?.cleanliness || 0,
      communication: my_review?.communication || 0,
      accuracy: my_review?.accuracy || 0,
      checkIn: my_review?.checkIn || 0,
      location: my_review?.location || 0,
      value: my_review?.value || 0,
      comment: my_review?.comment || '',
    },
  })

  const handleSubmitReview = async (values: ServiceReviewFormValues) => {
    try {
      setIsSubmitting(true)
      if (!user) {
        const callbackUrl = encodeURIComponent(`/home/services/${serviceId}`)
        router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
        return
      }
      if (!my_review) {
        await submitReview(serviceId, user!.id!, values)
      } else {
        await updateReview(my_review.id, values)
      }
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
      router.refresh()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>Share your experience with this service</DialogDescription>
            </DialogHeader>
        
            <div className="grid grid-cols-2 gap-3">
            {['cleanliness', 'communication', 'accuracy', 'checkIn', 'location', 'value'].map((category) => (
              <FormField
                key={category}
                control={form.control}
                name={category as keyof ServiceReviewFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{category.charAt(0).toUpperCase() + category.slice(1)}</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= +field.value! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => field.onChange(star)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            </div>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your review here..." {...field} />
                  </FormControl>
                  <FormDescription>Provide details about your experience</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <BeatLoader /> : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}