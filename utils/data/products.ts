"server only"

import { prisma } from "@/prisma/connection"

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
        take: 4
    })
}

export async function getProductReviews (productId: string) {
    return await prisma.productReview.findMany({
        where: {productId: productId},
        include: {reviewer: true}
    })
}