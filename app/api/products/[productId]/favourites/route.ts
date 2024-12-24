import { NextResponse } from "next/server"
import { prisma } from "@/prisma/connection"
import { currentUser } from "@/lib/auth"

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const user = await currentUser()
        const productId = params.productId

        if (!productId) {
            return new NextResponse("product ID is required", { status: 400 })
        }

        const like = await prisma.favouriteProduct.findFirst({
            where: {
                productId: productId,
                userId: user?.id
            }
        })

        if (like) {
            return NextResponse.json({ isLiked: true })
        } else {
            return NextResponse.json({ isLiked: false })
        }
    } catch (error) {
        console.log('[product_FAVOURITES_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}