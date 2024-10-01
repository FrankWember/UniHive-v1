"use server"

import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"

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

  const imageUrls = await Promise.all(
    data.images.map(async (image) => {
      const fileName = `${Date.now()}-${image.name}`
      const signedUrl = await generatePresignedUrl(fileName, image.type)
      await fetch(signedUrl, {
        method: "PUT",
        body: image,
        headers: {
          "Content-Type": image.type,
        },
      })
      return getS3Url(fileName)
    })
  )

  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: imageUrls,
      providerId: session.user.id,
    },
  })

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
    images: (string | File)[]
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

  const imageUrls = await Promise.all(
    data.images.map(async (image) => {
      if (typeof image === 'string') {
        return image
      } else {
        const fileName = `${Date.now()}-${image.name}`
        const signedUrl = await generatePresignedUrl(fileName, image.type)
        await fetch(signedUrl, {
          method: "PUT",
          body: image,
          headers: {
            "Content-Type": image.type,
          },
        })
        return getS3Url(fileName)
      }
    })
  )

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