"server only"

import { prisma } from '@/prisma/connection'

export async function getStudyGroups(courseId: string) {
  return await prisma.studyGroup.findMany({
    where: {
      courseId: courseId
    },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })
}

export async function getStudyGroupById(groupId: string) {
  return await prisma.studyGroup.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: true
        }
      },
      course: true
    }
  })
}