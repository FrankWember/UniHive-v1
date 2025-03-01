"use server"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToS3 } from "@/utils/s3"
import { uploadToUploadThing, deleteFromGoogleDrive } from '@/lib/cloud-storage';
import { currentUser } from "@/lib/auth";

export async function getAllEvents () {
  return await prisma.event.findMany({
    include: {
      creator: true
    }
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
  dateTime: Date
  location: string
  images: string[]
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an event")
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      dateTime: data.dateTime,
      location: data.location,
      creatorId: session.user.id,
      images: data.images
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
    dateTime: Date
    location: string
    images: string[]
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update an event")
  }

  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }


  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      dateTime: data.dateTime,
      location: data.location,
      images: data.images,
    },
  })

  return event
}


export async function getMatchedEvents(searchParams: { [key: string]: string | string[] | undefined }) {
  const user = await currentUser()
  const userId = user?.id

  let query: any = {}

  if (searchParams.type) {
    query.type = searchParams.type as string
  }

  if (searchParams.mine === 'true' && userId) {
    query.creatorId = userId
  }

  if (searchParams.attending === 'true' && userId) {
    query.attendees = {
      some: {
        userId: userId
      }
    }
  }

  const events = await prisma.event.findMany({
    where: query,
    include: {
      creator: {
        select: {
          name: true,
          image: true
        }
      },
      attendees: {
        select: {
          userId: true
        }
      }
    },
    orderBy: {
      dateTime: 'asc'
    }
  })

  return events
}


export async function deleteEvent (eventId: string, userId: string) {
  if (!userId) return null
  return await prisma.event.delete({where: {id: eventId}})
}
