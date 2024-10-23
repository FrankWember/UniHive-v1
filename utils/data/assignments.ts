"server only"

import { prisma } from '@/prisma/connection'

export async function getAssignments(courseId: string) {
  return await prisma.assignment.findMany({
    where: { courseId: courseId },
    include: {
      uploader: true,
      votes: true,
    },
  })
}