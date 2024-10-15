"use server"

import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToUploadThing, deleteFromUploadThing } from '@/lib/cloud-storage';
import { ServiceSchema } from "@/constants/zod";
import * as z from 'zod'
import { currentUser } from "@/lib/auth";

interface MyService {
  name: string,
  description: string,
  price: number,
  category: string[],
  images: string[]
}

export async function createService(data: MyService) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a service")
  }

  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      providerId: session.user.id,
      images: data.images
    },
  })
  return service
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      provider: true
    }
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
  data: MyService
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
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: data.images,
    },
  })

  return updatedService
}


export async function getAllServices () {
  return await prisma.service.findMany({
    include: {
      provider: true
    }
  })
}


export async function getProviderById(id: string) {
  const provider = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true
    },
  })
  return provider
}

export async function getProviderServices(providerId: string) {
  const services = await prisma.service.findMany({
    where: { providerId },
    include: {
      provider: {
        select: { id: true, name: true },
      },
    },
  })
  return services
}

export async function getMatchedServices(searchParams: { [key: string]: string | string[] | undefined }) {
  const user = await currentUser()
  const userId = user?.id

  let query: any = {}

  if (searchParams.category) {
    query.category = {
      has: searchParams.category as string
    }
  }

  if (searchParams.mine === 'true' && userId) {
    query.providerId = userId
  }

  const services = await prisma.service.findMany({
    where: query,
    include: {
      provider: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  return services
}