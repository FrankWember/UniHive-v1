import { currentUser } from "@/lib/auth"
import { prisma } from "@/prisma/connection"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const seller = await currentUser()
    const sellerId = seller?.id!
    try {
        const orders = await prisma.cartItem.findMany({
            where: {
                cart: {
                    isOrdered: true
                },
                product: {
                    sellerId: sellerId
                }
            },
            include: {
                cart: {
                    include: {
                        customer: true
                    }
                },
                product: true
            }
        })
        return NextResponse.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}