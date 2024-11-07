"use server"

import { generatePresignedUrl, getS3Url } from "@/utils/s3"
import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToUploadThing, deleteFromUploadThing } from '@/lib/cloud-storage';
import { ServiceSchema } from "@/constants/zod";
import * as z from 'zod'
import { currentUser } from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/mail'

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


export async function getBookingsForService(serviceId: string) {
  return await prisma.bookedServices.findMany({
    where: { serviceId },
    orderBy: { startTime: 'desc' },
  })
}

export async function getBookingById(bookingId: string) {
  return await prisma.bookedServices.findUnique({
    where: { id: bookingId },
    include: { service: true, buyer: true }
  })
}

export async function bookService(serviceId: string, userId: string, startTime: Date, stopTime: Date, notes: string) {
  const service = await getServiceById(serviceId)
  if (!service) throw new Error("Service not found")

  const booking = await prisma.bookedServices.create({
    data: {
      serviceId,
      buyerId: userId,
      startTime,
      stopTime,
      notes,
      price: service.price,
    },
    include: { service: true, buyer: true }
  })

  await sendEmail({
    to: service.provider.email,
    subject: "New Booking Request",
    text: `You have a new booking request for ${service.name}. Please check your dashboard to approve or reject the booking.`,
    html: `
      <h2>New Booking Request</h2>
      <p>You have a new booking request for <strong>${service.name}</strong>.</p>
      <p>Please check your dashboard to approve or reject the booking.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/home/services/${serviceId}/bookings" class="button">View Booking</a>
    `
  })

  revalidatePath(`/home/services/${serviceId}`)
  return booking
}

export async function agreeBooking(bookingId: string) {
  const booking = await prisma.bookedServices.update({
    where: { id: bookingId },
    data: { isAgreed: true, status: 'agreed' },
    include: { service: true, buyer: true }
  })

  await sendEmail({
    to: booking.buyer.email,
    subject: "Booking Agreed",
    text: `Your booking for ${booking.service.name} has been agreed. Please proceed with the payment.`,
    html: `
      <h2>Booking Agreed</h2>
      <p>Your booking for <strong>${booking.service.name}</strong> has been agreed.</p>
      <p>Please click the button below to proceed with the payment:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/home/services/payment/${booking.id}" class="button">Proceed to Payment</a>
    `
  })

  revalidatePath(`/home/services/${booking.serviceId}/bookings/${bookingId}`)
  return booking
}

export async function cancelBooking(bookingId: string) {
  const booking = await prisma.bookedServices.update({
    where: { id: bookingId },
    data: { isCanceled: true, status: 'canceled' },
    include: { service: true, buyer: true }
  })

  if (booking.isPaid) {
    // Implement refund logic here
  }

  await sendEmail({
    to: booking.buyer.email,
    subject: "Booking Canceled",
    text: `Your booking for ${booking.service.name} has been canceled. ${booking.isPaid ? 'A refund will be processed shortly.' : ''}`,
    html: `
      <h2>Booking Canceled</h2>
      <p>Your booking for <strong>${booking.service.name}</strong> has been canceled.</p>
      ${booking.isPaid ? '<p>A refund will be processed shortly.</p>' : ''}
    `
  })

  revalidatePath(`/home/services/${booking.serviceId}/bookings/${bookingId}`)
  return booking
}

export async function processPayment(bookingId: string, paymentMethod: string) {
  const thisBooking = await prisma.bookedServices.findUnique({
    where: { id: bookingId },
    include: { service: true, buyer: true }
  })
  const booking = await prisma.bookedServices.update({
    where: { id: bookingId },
    data: { 
      isPaid: true, 
      status: 'paid',
      reciept: {
        create: {
          payerId: thisBooking!.buyerId,
          receiverId: thisBooking!.service.providerId,
          amount: thisBooking!.price,
          paymentType: paymentMethod,
          status: 'completed'
        }
      }
    },
    include: { service: { include: { provider: true } }, buyer: true }
  })

  await sendEmail({
    to: booking.service.provider.email,
    subject: "Payment Received",
    text: `Payment has been received for your service ${booking.service.name}.`,
    html: `
      <h2>Payment Received</h2>
      <p>Payment has been received for your service <strong>${booking.service.name}</strong>.</p>
      <p>Amount: $${booking.price.toFixed(2)}</p>
      <p>Payment method: ${paymentMethod}</p>
    `
  })

  revalidatePath(`/home/services/${booking.serviceId}/bookings/${bookingId}`)
  return booking
}

export async function completeService(bookingId: string) {
  const booking = await prisma.bookedServices.update({
    where: { id: bookingId },
    data: { isCompleted: true, status: 'completed' },
    include: { service: { include: { provider: true } }, buyer: true }
  })

  const sellerPayment = booking.price * 0.8

  await sendEmail({
    to: booking.service.provider.email,
    subject: "Service Completed",
    text: `Your service ${booking.service.name} has been marked as completed. Payment of $${sellerPayment.toFixed(2)} will be transferred to your account.`,
    html: `
      <h2>Service Completed</h2>
      <p>Your service <strong>${booking.service.name}</strong> has been marked as completed.</p>
      <p>Payment of <strong>$${sellerPayment.toFixed(2)}</strong> will be transferred to your account.</p>
    `
  })

  await sendEmail({
    to: booking.buyer.email,
    subject: "Service Completed",
    text: `The service ${booking.service.name} has been marked as completed. Thank you for using our platform.`,
    html: `
      <h2>Service Completed</h2>
      <p>The service <strong>${booking.service.name}</strong> has been marked as completed.</p>
      <p>Thank you for using our platform.</p>
    `
  })

  revalidatePath(`/home/services/${booking.serviceId}/bookings/${bookingId}`)
  return booking
}