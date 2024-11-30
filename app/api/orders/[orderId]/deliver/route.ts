import { prisma } from "@/prisma/connection";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
    try {
        const order = await prisma.cartItem.update({
            where: { id: params.orderId },
            data: { isDelivered: true }
        })
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}