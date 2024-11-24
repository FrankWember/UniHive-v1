"use server"

import { prisma } from "@/prisma/connection"
import { Product } from "@prisma/client"

export async function addItemToCart(product: Product, customerId: string) {
    let my_cart = null
    const cart = await prisma.cart.findFirst({
        where: { customerId: customerId, isOrdered: false }
    })

    if (!cart) {
        my_cart = await prisma.cart.create({
            data: {
                customerId: customerId,
                totalPrice: product.price,
                cartItems: {
                    create: {
                        wasRequested: false,
                        price: product.price,
                        quantity: 1,
                        productId: product.id
                    }
                }
            }
        })
    } else {
        my_cart = await prisma.cart.update({
            where: {id: cart.id},
            data: {
                totalPrice: cart.totalPrice + product.price,
                cartItems: {
                    create: {
                        wasRequested: false,
                        price: product.price,
                        quantity: 1,
                        productId: product.id
                    }
                }
                
            }
        })
    }
}