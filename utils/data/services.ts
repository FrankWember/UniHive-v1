"server only"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToUploadThing, deleteFromUploadThing } from '@/lib/cloud-storage';
import { currentUser } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

export async function getServiceById(serviceId: string) {
  return await prisma.service.findUnique({
    where: { id: serviceId },
    include: { provider: true }
  })
}

export async function getBookedServiceById(bookedServiceId: string) {
    return await prisma.bookedServices.findUnique({
      where: { id: bookedServiceId },
      include: { service: true }
    })
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
  


export async function getServiceReviews (serviceId: string) {
    return await prisma.serviceReview.findMany({
        where: {serviceId: serviceId},
        include: {reviewer: true}
    })
}