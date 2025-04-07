import { prisma } from "@/prisma/connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userIds } = body;


    if (!Array.isArray(userIds) || !userIds.every(id => typeof id === "string")) {
      console.error("Invalid userIds format:", userIds);
      return NextResponse.json({ error: "Invalid userIds format. Expected an array of strings." }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        name: true,
        image: true
      }
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}