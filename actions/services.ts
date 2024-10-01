"use server"

import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import {prisma} from "@/prisma/connection"
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