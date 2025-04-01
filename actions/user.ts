"use server"

import {prisma} from "@/prisma/connection"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { currentUser } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { sendEmail } from "@/lib/mail"
import { APP_URL } from "@/constants/paths"

export async function updateUserSettings(data: {
  name?: string
  student_id?: string
  phone_number?: string
  bio?: string
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
      bio: data.bio,
    },
  })

  return updatedUser
}

export async function completeOnboarding(data: {
  profileImage?: string
  bio?: string
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
      bio: data.bio,
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

export async function changeUserRole(userId: string, role: UserRole) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role: role
    }
  })
  return user
}

export async function sendAccountUpgradeEmail() {
  const user = await currentUser()

  await sendEmail({
      to: 'notifications@dormbiz.net',
      subject: 'DormBiz Account Upgrade',
      text: `The User with email ${user?.email} has requested an upgrade to premium account.`,
      html: `
          <h1>The Following User has requested an upgrade to premium account:</h1>
          <p>Name: ${user?.name}</p>
          <p>Email: ${user?.email}</p>
          <p>Head out to the <a href="${APP_URL}/admin">Admin Page</a> to upgrade this account.</p>
      `
  })
}
