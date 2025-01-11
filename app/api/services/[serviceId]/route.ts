import { NextResponse } from "next/server"
import { prisma } from "@/prisma/connection"


export async function GET(
    req: Request,
    { params }: { params: { serviceId: string } }
) {
    try {
        const serviceId = params.serviceId

        if (!serviceId) {
            return new NextResponse("Service ID is required", { status: 400 })
        }

        const service = await prisma.service.findUnique({
            where: {
                id: serviceId
            }
        })

        if (service) {
            return NextResponse.json(service)
        } else {
            return new NextResponse("Service not found", { status: 404 })
        }
    } catch (error) {
        console.log('[SERVICE_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}