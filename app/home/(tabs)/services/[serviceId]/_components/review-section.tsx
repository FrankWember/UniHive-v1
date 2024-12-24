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
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
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
        <DialogTrigger>
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
      <div className="space-y-4">
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