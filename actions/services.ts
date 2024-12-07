"use server"

// import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToUploadThing, deleteFromUploadThing } from '@/lib/cloud-storage';
import { currentUser } from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { ServiceSchema } from "@/constants/zod";
import * as z from 'zod'


export async function createService(values: z.infer<typeof ServiceSchema>) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a service")
  }

  const service = await prisma.service.create({
    data: {
      name: values.name,
      price: values.price,
      discount: values.discount || 0,
      category: values.category,
      providerId: session.user.id,
      images: values.images,
      defaultLocation: values.defaultLocation,
      availability: values.availability
    },
  })
  return service
}


export async function deleteService(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a service")
  }

  const service = await prisma.service.findUnique({
    where: { id },
  })

  if (!service || service.providerId !== session.user.id) {
    throw new Error("You do not have permission to delete this service")
  }

  await deleteFromUploadThing(service.images)

  await prisma.service.delete({
    where: { id },
  })
}

export async function updateService(
  id: string,
  values: z.infer<typeof ServiceSchema>
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a service")
  }

  const service = await prisma.service.findUnique({
    where: { id },
  })

  if (!service || service.providerId !== session.user.id) {
    throw new Error("You do not have permission to update this service")
  }

  const updatedService = await prisma.service.update({
    where: { id },
    data: {
      name: values.name,
      price: values.price,
      discount: values.discount || 0,
      category: values.category,
      images: values.images,
      defaultLocation: values.defaultLocation,
      availability: values.availability
    },
  })

  return updatedService
}

export async function likeService (serviceId: string) {
  const user = await currentUser()
  const userId = user?.id
  if (!userId) {
    throw new Error("You must be logged in to like a service")
  }

  const like = await prisma.favoriteService.findFirst({
    where: {
      serviceId: serviceId,
      userId: userId
    }
  })

  if (like) {
    await prisma.favoriteService.delete({
      where: {
        id: like.id
      }
    })
    return false
  } else {
    await prisma.favoriteService.create({
      data: {
        serviceId: serviceId,
        userId: userId
      }
    })
    return true
  }
}

export async function isFavouriteService (serviceId: string) {
  const user = await currentUser()
  const userId = user?.id
  if (!userId) {
    throw new Error("You must be logged in to like a service")
  }

  const like = await prisma.favoriteService.findFirst({
    where: {
      serviceId: serviceId,
      userId: userId
    }
  })

  if (like) {
    return true
  } else {
    return false
  }
}


