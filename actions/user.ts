"use server"

import {prisma} from "@/prisma/connection"
import { auth } from "@/auth"

export async function updateUserSettings(data: {
  name?: string
  student_id?: string
  phone_number?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your settings")
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      studentId: data.student_id,
      phone: data.phone_number,
    },
  })

  return updatedUser
}