"use server"

import { prisma } from "@/prisma/connection"
import * as z from 'zod'
import { productSchema } from '@/constants/zod'
import { Product, User } from "@prisma/client"
import { sendEmail } from "@/lib/mail"
import { currentUser } from "@/lib/auth"


export async function createProduct(values: z.infer<typeof productSchema>, sellerId: string) {
    const product = await prisma.product.create({
        data: {
            name: values.name,
            description: values.description,
            price: values.price,
            discount: values.discount,
            stock: values.stock,
            images: values.images,
            brand: values.brand,
            categories: values.categories,
            sellerId: sellerId,
            delivery: values.delivery,
            defaultDeliveryLocation: values.defaultDeliveryLocation,
            averageDeliveryTime: values.averageDeliveryTime
        }
    })
    return product
}

export async function updateProduct(id: string, values: z.infer<typeof productSchema>) {
    const product = await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: values.name,
            description: values.description,
            price: values.price,
            discount: values.discount,
            stock: values.stock,
            images: values.images,
            brand: values.brand,
            categories: values.categories,
            delivery: values.delivery,
            defaultDeliveryLocation: values.defaultDeliveryLocation,
            averageDeliveryTime: values.averageDeliveryTime
        }
    })
    return product
}

export async function deleteProduct(id: string) {
    const product = await prisma.product.delete({
        where: {
            id: id
        }
    })
    return product
}

export async function requestDiscount(product: Product & { seller: User }, price: number, quantity: number, customerId: string) {
    const discount = await prisma.productRequest.create({
        data: {
            productId: product.id,
            price: price,
            quantity: quantity,
            customerId: customerId
        }
    })

    // Send email to seller about the discount request
    await sendEmail({
        to: product.seller.email!,
        subject: "New Discount Request",
        text: `A customer has requested a discount for ${product.name}`,
        html: `
            <h2>New Discount Request</h2>
            <p>A customer has requested a discount for your product: ${product.name}</p>
            <ul>
                <li>Original Price: $${product.price}</li>
                <li>Requested Price: $${price}</li>
                <li>Quantity: ${quantity}</li>
                <li>Total Discount: $${(product.price * quantity - price * quantity).toFixed(2)}</li>
            </ul>
            <p>Login to your account to respond to this request.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://unihive-v1.vercel.app"}/home/products/${product.id}/requests" class="button">View Discount Request</a>
        `
    })

    return discount
}

export async function acceptDiscountRequest (requestId: string) {
    const discount = await prisma.productRequest.update({
        where: { id: requestId },
        data: { isAccepted: true },
        include: { product: true, customer: true }
    })

    let my_cart = null

    const cart = await prisma.cart.findFirst({
        where: { customerId: discount.customerId, isOrdered: false}
    })

    if (!cart) {
        my_cart = await prisma.cart.create({
            data: {
                customerId: discount.customerId,
                totalPrice: discount.price,
                cartItems: {
                    create: {
                        wasRequested: true,
                        price: discount.price,
                        quantity: discount.quantity,
                        productId: discount.productId
                    }
                }
            }
        })
    } else {
        my_cart = await prisma.cart.update({
            where: {id: cart.id},
            data: {
                totalPrice: cart.totalPrice + discount.price,
                cartItems: {
                    create: {
                        wasRequested: true,
                        price: discount.price,
                        quantity: discount.quantity,
                        productId: discount.productId
                    }
                }
                
            }
        })
    }

    sendEmail({
        to: discount.customer.email!,
        subject: "Discount Request Accepted",
        text: `Your discount request for ${discount.product.name} has been accepted.`,
        html: `
            <h2>Discount Request Accepted</h2>
            <p>Your discount request for ${discount.product.name} has been accepted.</p>
            <ul>
                <li>Original Price: $${discount.product.price}</li>
                <li>Requested Price: $${discount.price}</li>
                <li>Quantity: ${discount.quantity}</li>
                <li>Total Discount: $${(discount.product.price * discount.quantity - discount.price * discount.quantity).toFixed(2)}</li>
            </ul>
            <p>You can now check out the product in your cart.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://unihive-v1.vercel.app"}/home/products/cart/${my_cart.id}" class="button">Checkout</a>
        `
    })
}


export async function rejectDiscountRequest (requestId: string) {
    const discount = await prisma.productRequest.update({
        where: { id: requestId },
        data: { isAccepted: false, isDenied: true },
        include: { product: true, customer: true }
    })

    sendEmail({
        to: discount.customer.email!,
        subject: "Discount Request Rejected",
        text: `Your discount request for ${discount.product.name} has been rejected.`,
        html: `
            <h2>Discount Request Rejected</h2>
            <p>Your discount request for ${discount.product.name} has been rejected.</p>
            <p>You can still buy the product at the original price.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://unihive-v1.vercel.app"}/home/products/${discount.product.id}" class="button">View Product</a>
        `
    })
}

export async function makeProductReview (productId: string, rating: number, comment: string, reviewerId: string) {
    const review = await prisma.productReview.create({
        data: {
            productId: productId,
            rating: rating,
            comment: comment,
            reviewerId: reviewerId
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


export async function updateProductReview (reviewId: string, rating: number, comment: string) {
    const review = await prisma.productReview.update({
        where: { id: reviewId },
        data: {
            rating: rating,
            comment: comment
        }
    })
    return review
}

export async function isFavouriteProduct (productId: string) {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) {
      throw new Error("You must be logged in to like a service")
    }
  
    const like = await prisma.favouriteProduct.findFirst({
      where: {
        productId: productId,
        userId: userId
      }
    })
  
    if (like) {
      return true
    } else {
      return false
    }
  }

  export async function likeProduct (productId: string) {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) {
      throw new Error("You must be logged in to like a service")
    }
  
    const like = await prisma.favouriteProduct.findFirst({
      where: {
        productId: productId,
        userId: userId
      }
    })
  
    if (like) {
      await prisma.favouriteProduct.delete({
        where: {
          id: like.id
        }
      })
      return false
    } else {
      await prisma.favouriteProduct.create({
        data: {
          productId: productId,
          userId: userId
        }
      })
      return true
    }
  }