"use server"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToS3 } from "@/utils/s3"
import { uploadToUploadThing, deleteFromGoogleDrive } from '@/lib/cloud-storage';

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
  images: File[]
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
      dateTime: new Date(data.dateTime),
      location: data.location,
      creatorId: session.user.id,
    },
  })

  const imageUrls = await uploadToUploadThing(data.images);

  await prisma.event.update({
    where: { id: event.id },
    data: { images: imageUrls },
  });

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

  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  // Delete old images that are not in the new data
  const oldImages = existingEvent.images as string[];
  const imagesToKeep = data.images.filter((img): img is string => typeof img === 'string');
  const imagesToDelete = oldImages.filter(img => !imagesToKeep.includes(img));
  await Promise.all(imagesToDelete.map(deleteFromGoogleDrive));

  // Upload new images
  const newImages = data.images.filter((img): img is File => img instanceof File);
  const newImageUrls = await uploadToUploadThing(newImages);

  const updatedImageUrls = [...imagesToKeep, ...newImageUrls];

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      dateTime: new Date(data.dateTime),
      location: data.location,
      images: updatedImageUrls,
    },
  })

  return event
}
