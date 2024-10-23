"use server"

import { prisma } from '@/prisma/connection'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@/lib/auth'

export async function createStudyGroup(courseId: string, name: string) {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')

  const studyGroup = await prisma.studyGroup.create({
    data: {
      name,
      courseId,
      members: {
        create: {
          userId: user.id!,
          isAdmin: true,
          joinRequestAccepted: true
        }
      }
    },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })

  revalidatePath(`/home/courses/${courseId}`)
  return studyGroup
}

export async function joinStudyGroup(groupId: string) {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')

  const studyGroup = await prisma.studyGroup.update({
    where: { id: groupId },
    data: {
      members: {
        create: {
          userId: user.id!,
          joinRequestAccepted: false
        }
      }
    },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })

  revalidatePath(`/home/courses/${studyGroup.courseId}`)
  return studyGroup
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

export async function addMemberToStudyGroup(groupId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const studyGroup = await prisma.studyGroup.update({
    where: { id: groupId },
    data: {
      members: {
        create: {
          userId: user.id,
          joinRequestAccepted: true
        }
      }
    }
  })

  revalidatePath(`/home/courses/study-group/${groupId}/settings`)
  return studyGroup
}

export async function removeMemberFromStudyGroup(groupId: string, memberId: string) {
  await prisma.studyGroupMember.delete({
    where: { id: memberId }
  })

  revalidatePath(`/home/courses/study-group/${groupId}/settings`)
}

export async function toggleAdminStatus(groupId: string, memberId: string) {
  const member = await prisma.studyGroupMember.findUnique({ where: { id: memberId } })
  if (!member) throw new Error('Member not found')

  await prisma.studyGroupMember.update({
    where: { id: memberId },
    data: { isAdmin: !member.isAdmin }
  })

  revalidatePath(`/home/courses/study-group/${groupId}/settings`)
}

export async function approveJoinRequest(groupId: string, memberId: string) {
  await prisma.studyGroupMember.update({
    where: { id: memberId },
    data: { joinRequestAccepted: true }
  })

  revalidatePath(`/home/courses/study-group/${groupId}/settings`)
}

export async function rejectJoinRequest(groupId: string, memberId: string) {
  await prisma.studyGroupMember.delete({
    where: { id: memberId }
  })

  revalidatePath(`/home/courses/study-group/${groupId}/settings`)
}

export async function leaveStudyGroup(groupId: string) {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')

  await prisma.studyGroupMember.deleteMany({
    where: {
      studyGroupId: groupId,
      userId: user.id
    }
  })

  revalidatePath(`/home/courses`)
}