"server only"

import { currentUser } from '@/lib/auth'
import { prisma } from '@/prisma/connection'

export async function getCart () {
    const customer = await currentUser()
    const customerId = customer?.id
    let my_cart = null
    my_cart = await prisma.cart.findFirst({
        where: { customerId: customerId, isOrdered: false },
        include: { cartItems: { include: { product: true } } }
    })

    if (!my_cart) {
        my_cart = await prisma.cart.create({
            data: {
                customerId: customerId!,
                totalPrice: 0,
            },
            include: { cartItems: { include: { product: true } } }
        })
    }

    return my_cart
}

export async function getCartItemsNumber () {
    const customer = await currentUser()
    if (!customer) return 0
    let my_cart = null
    const cart = await prisma.cart.findFirst({
        where: { customerId: customer?.id, isOrdered: false },
        include: { cartItems: true }
    })
     
    if (!cart) {
        my_cart = await prisma.cart.create({
            data: {
                customerId: customer!.id!,
                totalPrice: 0,
            },
            include: { cartItems: true }
        })
    } else {
        my_cart = cart
    }

    return my_cart.cartItems.length
}


export async function getCartItem (orderId: string) {
    return await prisma.cartItem.findUnique({
        where: { id: orderId },
        include: {
            cart: {
                include: {
                    customer: true
                }
            },
            product: true
        }
    });
}