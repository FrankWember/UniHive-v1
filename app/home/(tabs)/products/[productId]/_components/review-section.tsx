"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
import { User, ProductReview } from '@prisma/client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ProductReviewSchema, ProductReviewFormValues } from "@/constants/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCurrentUser } from '@/hooks/use-current-user'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { makeProductReview, updateProductReview } from '@/actions/product-reviews'
import { Badge } from '@/components/ui/badge'
import { BeatLoader } from 'react-spinners'
import { calculateProductReviewMetrics } from '@/utils/helpers/reviews'

interface ReviewsSectionProps {
  averageRating: number
  ratingCounts: Record<number, number>
  reviews: (ProductReview & {
    reviewer: User
  })[],
  productId: string
}

export function ReviewsSection({
  averageRating,
  ratingCounts,
  reviews,
  productId
}: ReviewsSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const my_review = reviews.find(review => review.reviewer.id === user?.id)

  // pagnation stuff
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const form = useForm<ProductReviewFormValues>({
    resolver: zodResolver(ProductReviewSchema),
    defaultValues: {
      comment: my_review?.comment || "",
      value: my_review?.value || 0,
      meetUp: my_review?.meetUp || 0,
      location: my_review?.location || 0,
      communication: my_review?.communication || 0,
      packaging: my_review?.packaging || 0,
      experience: my_review?.experience || 0,
    },
  })

  const handleSubmitReview = async (values: ProductReviewFormValues) => {
    setIsSubmitting(true)
    try {
        if (!user) {
            const callbackUrl = encodeURIComponent(`/home/products/${productId}`)
            router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
            return
        }
        if (!my_review) {
            await makeProductReview(productId, user!.id!, values)
        } else {
            await updateProductReview(my_review.id, values)
        }
    } catch {
        console.log("An error occured")
    } finally {
        setIsSubmitting(false)
        router.refresh()
    } 
  }

  const StarRating = ({ name, value, onChange }: { name: string, value: number, onChange: (value: number) => void }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer ${
            star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col justify-center space-y-4 w-full">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold">{averageRating}</div>
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
      </div>
      <div className="flex flex-col py-4 gap-4">
        {currentReviews.map((review) => (
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
                      star <= calculateProductReviewMetrics([review])?.overall! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
            </CardContent>
          </Card>
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
      <div className='flex justify-end'>
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
              <DialogDescription>Share your experience with this product</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {['value', 'meetUp', 'location', 'communication', 'packaging', 'experience', 'timeliness'].map((cat) => (
                    <FormField
                        key={cat}
                        control={form.control}
                        name={cat as keyof ProductReviewFormValues}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{cat.charAt(0).toUpperCase() + cat.slice(1)}</FormLabel>
                            <FormControl>
                            <StarRating
                                name={cat}
                                value={+field.value!}
                                onChange={(value) => field.onChange(value)}
                            />
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <BeatLoader /> : "Submit Review"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
