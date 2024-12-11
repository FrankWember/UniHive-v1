import { prisma } from "@/prisma/connection";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { customerId: string } }
) {
    try {
        const customer = await prisma.user.findUnique({
            where: { id: params.customerId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        });

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }
}
