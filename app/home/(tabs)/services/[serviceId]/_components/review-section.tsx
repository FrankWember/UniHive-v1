"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageSquare } from 'lucide-react'
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
import { BeatLoader } from 'react-spinners'
import { ServiceReview, User } from '@prisma/client'

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
  
export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
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
              <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? <BeatLoader /> : "Send Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }