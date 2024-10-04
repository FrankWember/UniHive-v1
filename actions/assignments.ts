"use server"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"

export async function getAssignments(courseId: string) {
  return prisma.assignment.findMany({
    where: { courseId },
    include: {
      uploader: {
        select: { id: true, name: true },
      },
      votes: true,
    },
    orderBy: { uploadDate: 'desc' },
  })
}

export async function createAssignment(data: {
  courseId: string
  title: string
  description: string
  filePath: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an assignment")
  }

  return prisma.assignment.create({
    data: {
      ...data,
      uploaderId: session.user.id,
    },
  })
}

export async function updateAssignment(
  id: string,
  data: { title?: string; description?: string; filePath?: string }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update an assignment")
  }

  const assignment = await prisma.assignment.findUnique({ where: { id } })
  if (!assignment || assignment.uploaderId !== session.user.id) {
    throw new Error("You can only update your own assignments")
  }

  return prisma.assignment.update({
    where: { id },
    data,
  })
}

export async function deleteAssignment(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete an assignment")
  }

  const assignment = await prisma.assignment.findUnique({ where: { id } })
  if (!assignment || assignment.uploaderId !== session.user.id) {
    throw new Error("You can only delete your own assignments")
  }

  return prisma.assignment.delete({
    where: { id },
  })
}

export async function voteAssignment(assignmentId: string, value: 1 | -1) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to vote on an assignment")
  }

  return prisma.assignmentVote.upsert({
    where: {
      assignmentId_userId: {
        assignmentId,
        userId: session.user.id,
      },
    },
    update: { value },
    create: {
      assignmentId,
      userId: session.user.id,
      value,
    },
  })
}