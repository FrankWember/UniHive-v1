"server only"

import { prisma } from '@/prisma/connection'

export async function getCourseById(courseId: string) {
  return await prisma.course.findUnique({
    where: { id: courseId },
  })
}

export async function getCourseUsers(courseId: string) {
  const studyGroup = await prisma.studyGroup.findFirst({
    where: { courseId: courseId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  })

  return studyGroup?.members.map(member => member.user) || []
}