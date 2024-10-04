"use server"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToS3 } from "@/utils/s3"

export async function searchEvents(query: string) {
  const events = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { creator: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      creator: {
        select: { id: true, name: true },
      },
    },
  })

  const creators = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
  })

  return [
    ...events.map((event) => ({
      id: event.id,
      name: event.title,
      type: 'event' as const,
      creatorName: event.creator.name,
    })),
    ...creators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      type: 'creator' as const,
    })),
  ]
}


export async function getMatchedEvents(searchParams: { [key: string]: string | string[] | undefined }) {
  const session = await auth()
  const userId = session?.user?.id

  const where: any = {}

  if (searchParams.mine === 'true' && userId) {
    where.creatorId = userId
  }

  if (searchParams.type) {
    where.type = searchParams.type
  }

  if (searchParams.attending === 'true' && userId) {
    where.attendees = {
      some: {
        userId: userId
      }
    }
  }

  return prisma.event.findMany({
    where,
    include: {
      creator: {
        select: { id: true, name: true },
      },
    },
    orderBy: { dateTime: 'asc' },
  })
}


export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, name: true },
      },
      attendees: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
    },
  })
}

export async function addAttendee(eventId: string, userId: string) {
  return prisma.eventAttendee.create({
    data: {
      eventId,
      userId,
    },
  })
}

export async function removeAttendee(eventId: string, userId: string) {
  return prisma.eventAttendee.delete({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  })
}

export async function isUserAttending(eventId: string, userId: string) {
  const attendee = await prisma.eventAttendee.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  })
  return !!attendee
}


export async function createEvent(data: {
  title: string
  description: string
  type: string
  dateTime: string
  location: string
  images: (string | File)[]
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an event")
  }

  // Upload images to S3
  const imageUrls = await Promise.all(
    data.images.map(async (image) => {
      if (typeof image === 'string') {
        return image // If it's already a URL, keep it as is
      } else {
        return await uploadToS3(image)
      }
    })
  )

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      dateTime: new Date(data.dateTime),
      location: data.location,
      images: imageUrls,
      creatorId: session.user.id,
    },
  })

  return event
}



export async function updateEvent(
  eventId: string,
  data: {
    title: string
    description: string
    type: string
    dateTime: string
    location: string
    images: (string | File)[]
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update an event")
  }

  // Upload new images to S3
  const imageUrls = await Promise.all(
    data.images.map(async (image) => {
      if (typeof image === 'string') {
        return image // If it's already a URL, keep it as is
      } else {
        return await uploadToS3(image)
      }
    })
  )

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      dateTime: new Date(data.dateTime),
      location: data.location,
      images: imageUrls,
    },
  })

  return event
}