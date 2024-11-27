"server only"

import { prisma } from "@/prisma/connection"
import { currentUser } from "@/lib/auth"

export async function getAllProducts () {
    return await prisma.product.findMany()
}

export async function getProductsByCategory (category: string) {
    return await prisma.product.findMany({
        where: { categories: { has: category } }
    })
}

export async function getProductById (id: string) {
    return await prisma.product.findUnique({ where: { id }, include: { seller: true } })
}

export async function getRelatedProducts(productId: string, category: string) {
    return await prisma.product.findMany({
        where: {
            AND: [
                { categories: { has: category } },
                { id: { not: productId } }
            ]
        },
        include: { reviews: true },
        take: 4
    })
}

export async function getProductReviews (productId: string) {
    return await prisma.productReview.findMany({
        where: {productId: productId},
        include: {reviewer: true}
    })
}

export async function getMyProductReview (productId: string, userId: string) {
    return await prisma.productReview.findFirst({
        where: {productId: productId, reviewerId: userId}
    })
}


export async function getSellerById (id: string) {
    return await prisma.user.findUnique({ 
        where: { id }, 
        include: { 
            products: { 
                include: { reviews: true } 
            } 
        }
    })
}

export async function getSellerRequests () {
    const user = await currentUser()
    return await prisma.productRequest.findMany({
        where: { product: { sellerId: user!.id } },
        include: { product: true, customer: true }
    })
}