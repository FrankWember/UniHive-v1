import { prisma } from "@/prisma/connection"
import { NextRequest, NextResponse } from "next/server"

export async function GET (req: NextRequest) {
    try {
        const products = await prisma.product.findMany({
            include: {
                seller: true,
                reviews: true
            }
        })
        return NextResponse.json({products: products}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500})
    }
}