"use server"

import { prisma } from "@/prisma/connection"
import { sendEmail } from "@/lib/mail"
import { ProductReviewFormValues } from "@/constants/zod"

export async function makeProductReview (productId: string, reviewerId: string, values: ProductReviewFormValues) {
    const review = await prisma.productReview.create({
        data: {
            productId: productId,
            reviewerId: reviewerId,
            ...values
        },
        include: { product: {include: {seller: true}}, reviewer: true }
    })

    sendEmail({
        to: review.product.seller.email!,
        subject: "New Product Review",
        text: `A new review has been submitted for your product ${review.product.name}.`,
        html: `
            <h2>New Product Review</h2>
            <p>A new review has been submitted for your product <strong>${review.product.name}</strong>.</p>
            <p>Rating: ${review.rating}/5</p>
            <p>Comment: ${review.comment}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://unihive-v1.vercel.app"}/home/products/${review.product.id}" class="button">View Review</a>
        `
    })

    return review
}


export async function updateProductReview (reviewId: string, values: ProductReviewFormValues) {
    const review = await prisma.productReview.update({
        where: { id: reviewId },
        data: values
    })
    return review
}