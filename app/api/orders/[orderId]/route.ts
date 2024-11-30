import { prisma } from "@/prisma/connection";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const order = await prisma.cartItem.findUnique({
            where: { id: params.orderId },
            include: {
                cart: {
                    include: {
                        customer: true
                    }
                },
                product: true
            }
        });
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}