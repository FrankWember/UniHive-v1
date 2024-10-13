"use server"

import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToGoogleDrive, deleteFromGoogleDrive } from '@/lib/cloud-storage';

export async function createService(data: {
  name: string
  description: string
  price: number
  category: string[]
  images: File[]
}) {
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
    },
  })

  const folderUrl = `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_SERVICES_FOLDER_ID}/${service.id}`;
  const imageUrls = await uploadToGoogleDrive(data.images, folderUrl);

  await prisma.service.update({
    where: { id: service.id },
    data: { images: imageUrls },
  });

  return service
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
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

  // Delete images from Google Drive
  await Promise.all(service.images.map(deleteFromGoogleDrive));

  await prisma.service.delete({
    where: { id },
  })
}

export async function updateService(
  id: string,
  data: {
    name: string
    description: string
    price: number
    category: string[]
    images: File[]
  }
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

  const folderUrl = `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_SERVICES_FOLDER_ID}/${id}`;
  const imageUrls = await uploadToGoogleDrive(data.images, folderUrl);

  const updatedService = await prisma.service.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: imageUrls,
    },
  })

  return updatedService
}


export async function searchServices(query: string) {
  const services = await prisma.service.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { hasSome: [query] } },
        { provider: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      provider: {
        select: { id: true, name: true },
      },
    },
    take: 5,
  })

  const providers = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 3,
  })

  const categories = await prisma.service.findMany({
    where: {
      category: { hasSome: [query] },
    },
    select: {
      category: true,
    },
    distinct: ['category'],
    take: 3,
  })

  return [
    ...services.map((service) => ({
      id: service.id,
      name: service.name,
      type: 'service' as const,
      providerName: service.provider.name,
    })),
    ...providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      type: 'provider' as const,
    })),
    ...categories.flatMap((service) =>
      service.category.map((cat) => ({
        id: cat,
        name: cat,
        type: 'category' as const,
      }))
    ),
  ]
}


export async function getProviderById(id: string) {
  const provider = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
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
