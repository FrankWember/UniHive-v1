import { NextResponse } from "next/server"
import { prisma } from "@/prisma/connection"

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const productId = params.productId

        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 })
        }

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if (product) {
            return NextResponse.json(product)
        } else {
            return new NextResponse("Product not found", { status: 404 })
        }

    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}