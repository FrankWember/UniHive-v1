import { prisma } from "@/prisma/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
    try {
        const events = await prisma.event.findMany()
        return NextResponse.json({events: events}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500})
    }
}