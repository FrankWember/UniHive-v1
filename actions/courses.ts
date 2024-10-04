"use server"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"

export async function getCourses() {
  return prisma.course.findMany({
    orderBy: { title: 'asc' },
  })
}

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      studyGroups: true,
    },
  })
}

export async function createCourse(data: { title: string; code: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a course")
  }

  return prisma.course.create({
    data: {
      title: data.title,
      code: data.code,
    },
  })
}

export async function updateCourse(id: string, data: { title?: string; code?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a course")
  }

  return prisma.course.update({
    where: { id },
    data,
  })
}

export async function deleteCourse(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a course")
  }

  return prisma.course.delete({
    where: { id },
  })
}