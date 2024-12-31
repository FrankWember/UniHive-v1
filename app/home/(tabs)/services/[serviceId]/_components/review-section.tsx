"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { ServiceReview, User } from '@prisma/client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { ServiceReviewSchema, type ServiceReviewFormValues } from '@/constants/zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { submitReview, updateReview } from '@/actions/service-reviews'
import { BeatLoader } from 'react-spinners'


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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const my_review = reviews.find(review => review.reviewer.id === user?.id)

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

  const form = useForm<ServiceReviewFormValues>({
    resolver: zodResolver(ServiceReviewSchema),
    defaultValues: {
      rating: my_review?.rating || 0,
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
    <div className='flex flex-col gap-4'>
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
            <span className="flex text-sm min-w-16 text-muted-foreground">{rating} stars</span>
            <Progress value={((ratingCounts[rating] || 0) / reviews.length * 100) || 0} className="h-2 w-full" />
            <span className="w-12 text-sm text-muted-foreground text-right">
              {(((ratingCounts[rating] || 0) / reviews.length * 100).toFixed(0)) || 0}%
            </span>
          </div>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Share your experience with this service</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-8">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= field.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => field.onChange(star)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>Rate from 1 to 5</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <BeatLoader /> : "Submit Review"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 py-4 gap-4">
        {currentReviews.map((review) => (
          <div key={review.id} className='pt-6 border-t flex flex-col gap-1'>
            <div className="flex items-center space-x-4 mb-2">
              <Avatar>
                <AvatarImage src={review.reviewer.image || undefined} alt={review.reviewer.name || 'Reviewer'} className='object-center'/>
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
  )
}