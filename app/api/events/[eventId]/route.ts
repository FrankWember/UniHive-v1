import { NextResponse } from "next/server"
import { prisma } from "@/prisma/connection"


export async function GET(
    req: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const eventId = params.eventId

        if (!eventId) {
            return new NextResponse("Event ID is required", { status: 400 })
        }

        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })

        if (event) {
            return NextResponse.json(event)
        } else {
            return new NextResponse("Event not found", { status: 404 })
        }
    } catch (error) {
        console.log('[EVENT_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}