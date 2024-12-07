import { NextResponse } from "next/server"
import { prisma } from "@/prisma/connection"
import { currentUser } from "@/lib/auth"

export async function GET(
    req: Request,
    { params }: { params: { serviceId: string } }
) {
    try {
        const user = await currentUser()
        const serviceId = params.serviceId

        if (!serviceId) {
            return new NextResponse("Service ID is required", { status: 400 })
        }

        const like = await prisma.favoriteService.findFirst({
            where: {
                serviceId: serviceId,
                userId: user?.id
            }
        })

        if (like) {
            return NextResponse.json({ isLiked: true })
        } else {
            return NextResponse.json({ isLiked: false })
        }
    } catch (error) {
        console.log('[SERVICE_FAVOURITES_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}