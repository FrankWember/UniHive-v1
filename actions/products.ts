"use server"

import { prisma } from "@/prisma/connection"
import * as z from 'zod'
import { productSchema } from '@/constants/zod'


export async function createProduct(values: z.infer<typeof productSchema>, sellerId: string) {
    const product = await prisma.product.create({
        data: {
            name: values.name,
            description: values.description,
            price: values.price,
            stock: values.stock,
            images: values.images,
            categories: values.categories,
            sellerId: sellerId
        }
    })
    return product
}