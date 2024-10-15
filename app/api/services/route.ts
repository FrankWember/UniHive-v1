import { prisma } from "@/prisma/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
    try {
        const {query} = await req.json()
        const services = await prisma.service.findMany(query)
        return NextResponse.json({services: services}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500})
    }
}