"use server"

// import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToUploadThing, deleteFromUploadThing } from '@/lib/cloud-storage';
import { currentUser } from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { ServiceSchema } from "@/constants/zod";
import * as z from 'zod'


export async function reportScam(bookedServiceId: string, userId: string) {
  const updatedBookedService = await prisma.bookedServices.update({
    where: { id: bookedServiceId },
    data: {
      status: 'reported',
    }
  })

  // In a real-world scenario, you would create a separate scam report entry and notify administrators
  // For this example, we'll just update the status

  revalidatePath(`/home/services/confirmation/${bookedServiceId}`)
  return updatedBookedService
}


export async function createService(values: z.infer<typeof ServiceSchema>) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a service")
  }

  const service = await prisma.service.create({
    data: {
      name: values.name,
      description: values.description,
      price: values.price,
      discount: values.discount || 0,
      category: values.category,
      providerId: session.user.id,
      images: values.images,
      defaultLocation: values.defaultLocation
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
      description: values.description,
      price: values.price,
      discount: values.discount || 0,
      category: values.category,
      images: values.images,
    },
  })

  return updatedService
}



