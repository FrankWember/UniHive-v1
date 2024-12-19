"use server"

import {prisma} from "@/prisma/connection"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { currentUser } from "@/lib/auth"

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

export async function completeOnboarding(data: {
  profileImage: string
  agreeTerms: boolean
}) {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      image: data.profileImage,
      isOnboarded: true,
    },
  })

  revalidatePath('/home')
}

export async function updateProfileImage(url: string) {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not found")
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      image: url,
      isOnboarded: true
    },
  })

  revalidatePath('/home/settings')
}