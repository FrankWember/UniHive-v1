import { prisma } from "@/prisma/connection";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        image: true,
    },
    })


    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}