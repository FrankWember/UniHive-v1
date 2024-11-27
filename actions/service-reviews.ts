"use server"

import { prisma } from '@/prisma/connection'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/mail'

export async function submitReview(serviceId: string, reviewerId: string, rating: number, comment: string) {
  const review = await prisma.serviceReview.create({
    data: {
      serviceId,
      reviewerId,
      rating,
      comment,
    },
    include: { service: { include: { provider: true } }, reviewer: true },
  })

  // Send email notification to service provider
  await sendEmail({
    to: review.service.provider.email,
    subject: "New Service Review Submitted",
    text: `A new review has been submitted for your service ${review.service.name}.`,
    html: `
      <h2>New Service Review</h2>
      <p>A new review has been submitted for your service <strong>${review.service.name}</strong>.</p>
      <p>Rating: ${review.rating}/5</p>
      <p>Comment: ${review.comment}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/home/services/${review.serviceId}" class="button">View Review</a>
    `
  })

  revalidatePath(`/home/services/${serviceId}`)
  return review
}

export async function updateReview(reviewId: string, rating: number, comment: string) {
  const review = await prisma.serviceReview.update({
    where: { id: reviewId },
    data: {
      rating,
      comment,
    },
  })
  return review
}

export async function getReviewsByServiceId(serviceId: string) {
  return await prisma.serviceReview.findMany({
    where: { serviceId },
    include: { reviewer: true },
    orderBy: { reviewDate: 'desc' },
  })
}

export async function getReviewById(reviewId: string) {
  return await prisma.serviceReview.findUnique({
    where: { id: reviewId },
    include: { service: true, reviewer: true },
  })
}