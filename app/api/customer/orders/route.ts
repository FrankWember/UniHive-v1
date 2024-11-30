
import { currentUser } from '@/lib/auth'
import { prisma } from '@/prisma/connection'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const customer = await currentUser()
    const customerId = customer?.id!
    try {
        const orders = await prisma.cart.findMany({
            where: {
                customerId: customerId,
                isOrdered: true
            },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return NextResponse.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}