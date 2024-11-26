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