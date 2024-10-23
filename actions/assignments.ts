"use server"

import { currentUser } from '@/lib/auth'
import { prisma } from '@/prisma/connection'
import { revalidatePath } from 'next/cache'


export async function uploadAssignment(courseId: string, data: { title: string, description: string, file: string }) {
  const user = await currentUser()
  if (!user?.id) {
    throw new Error('Unauthorized')
  }

  const assignment = await prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description,
      filePath: data.file,
      courseId: courseId,
      uploaderId: user.id,
    }
  })

  revalidatePath(`/home/courses/${courseId}`)
  return assignment
}

export async function voteAssignment(courseId: string, assignmentId: string, value: number) {
  const user = await currentUser()
  if (!user?.id) {
    throw new Error('Unauthorized')
  }

  const existingVote = await prisma.assignmentVote.findUnique({
    where: {
      assignmentId_userId: {
        assignmentId: assignmentId,
        userId: user.id,
      },
    },
  })

  if (existingVote) {
    if (existingVote.value === value) {
      // Cancel the vote
      await prisma.assignmentVote.delete({
        where: {
          id: existingVote.id,
        },
      })
    } else {
      // Change the vote
      await prisma.assignmentVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          value: value,
        },
      })
    }
  } else {
    // Create a new vote
    await prisma.assignmentVote.create({
      data: {
        assignmentId: assignmentId,
        userId: user.id,
        value: value,
      },
    })
  }

  const updatedAssignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      votes: true,
    },
  })

  revalidatePath(`/home/courses/${courseId}`)
  return updatedAssignment
}
