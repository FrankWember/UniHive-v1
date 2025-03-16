"use server"

import { prisma } from "@/prisma/connection"
import { currentUser } from "@/lib/auth"
import { z } from "zod"
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/mail'
import { BookingStatus } from "@prisma/client"
import { ServiceBookingSchema } from "@/constants/zod"
import { JsonValue } from "@prisma/client/runtime/library"
import { parseBookingTime } from "@/utils/helpers/availability"
import { APP_URL } from "@/constants/paths"
import { getTimeRange as getBookingTimeRange } from "@/utils/helpers/time"


export async function createBooking(offerId: string, values: z.infer<typeof ServiceBookingSchema>) {
    try {
        const user = await currentUser()
        if (!user?.id) {
            throw new Error("Unauthorized")
        }

        const offer = await prisma.serviceOffer.findUnique({
            where: { id: offerId },
            include: { 
                service: { 
                    include: {
                        provider: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        if (!offer) {
            throw new Error("Service offer not found")
        }

        const booking = await prisma.serviceBooking.create({
            data: {
                offerId: offerId,
                customerId: user.id,
                date: values.date,
                time: values.time,
                status: BookingStatus.PENDING,
                location: values.location
            }
        })

        await sendEmail({
            to: offer.service.provider.email,
            subject: `New booking request: ${offer.service.name}`,
            text: `A new booking request has been made for ${offer.title}.`,
            html: `
                <h2>New Booking Request</h2>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Service:</strong> ${offer.service.name}</p>
                <p><strong>Offer:</strong> ${offer.title}</p>
                <p><strong>Date:</strong> ${values.date.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${getBookingTimeRange(booking.date, booking.time)}</p>
                <p><strong>Location:</strong> ${values.location || offer.service.defaultLocation}</p>
                <a href="${APP_URL}/home/services/${offer.service.id}/bookings/${booking.id}">View Booking</a>
            `
        })

        revalidatePath(`/home/services/${offer.service.id}/bookings`)
        revalidatePath(`/home/services/my-bookings`)
        return booking
    } catch (error) {
        console.error('[SERVICE_BOOKING_ERROR]', error)
        throw new Error("Failed to create booking")
    }
}

export async function acceptBooking(bookingId: string) {
    try {
        const user = await currentUser()
        if (!user?.id) {
            throw new Error("Unauthorized")
        }

        const booking = await prisma.serviceBooking.findUnique({
            where: { id: bookingId },
            include: { 
                offer: {
                    include: {
                        service: {
                            include: { provider: true }
                        }
                    }
                },
                customer: true
            }
        })

        if (!booking) {
            throw new Error("Booking not found")
        }

        if (booking.offer.service.providerId !== user.id) {
            throw new Error("Unauthorized")
        }

        const updatedBooking = await prisma.serviceBooking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.ACCEPTED }
        })

        await sendEmail({
            to: booking.customer.email,
            subject: "Booking Accepted",
            text: `Your booking for ${booking.offer.service.name} has been accepted!`,
            html: `
                <h2>Booking Accepted</h2>
                <p>Your booking for ${booking.offer.service.name} has been accepted!</p>
                <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${getBookingTimeRange(booking.date, booking.time)}</p>
                <p><strong>Location:</strong> ${booking.location || booking.offer.service.defaultLocation}</p>
                <p>Please proceed with the payment to confirm your booking.</p>
            `
        })

        revalidatePath(`/home/services/${booking.offer.service.id}/bookings/${bookingId}`)
        return updatedBooking
    } catch (error) {
        console.error('[ACCEPT_BOOKING_ERROR]', error)
        throw new Error("Failed to accept booking")
    }
}

export async function rejectBooking(bookingId: string) {
    try {
        const user = await currentUser()
        if (!user?.id) {
            throw new Error("Unauthorized")
        }

        const booking = await prisma.serviceBooking.findUnique({
            where: { id: bookingId },
            include: { 
                offer: {
                    include: {
                        service: {
                            include: { provider: true }
                        }
                    }
                },
                customer: true
            }
        })

        if (!booking) {
            throw new Error("Booking not found")
        }

        if (booking.offer.service.providerId !== user.id) {
            throw new Error("Unauthorized")
        }

        const updatedBooking = await prisma.serviceBooking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.REJECTED }
        })

        await sendEmail({
            to: booking.customer.email,
            subject: "Booking Rejected",
            text: `Unfortunately, your booking for ${booking.offer.service.name} has been rejected.`,
            html: `
                <h2>Booking Rejected</h2>
                <p>Unfortunately, your booking for ${booking.offer.service.name} has been rejected.</p>
                <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${getBookingTimeRange(booking.date, booking.time)}</p>
                <p><strong>Location:</strong> ${booking.location || booking.offer.service.defaultLocation}</p>
                <p>You may try booking a different time or contact the service provider.</p>
            `
        })

        revalidatePath(`/home/services/${booking.offer.service.id}/bookings/${bookingId}`)
        return updatedBooking
    } catch (error) {
        console.error('[REJECT_BOOKING_ERROR]', error)
        throw new Error("Failed to reject booking")
    }
}

export async function cancelBooking(bookingId: string, userId: string) {
    try {
        const booking = await prisma.serviceBooking.findUnique({
            where: { id: bookingId },
            include: { 
                offer: {
                    include: {
                        service: {
                            include: { provider: true }
                        }
                    }
                },
                customer: true
            }
        })

        if (!booking) {
            throw new Error("Booking not found")
        }

        if (booking.customerId !== userId && booking.offer.service.providerId !== userId) {
            throw new Error("Unauthorized")
        }

        const updatedBooking = await prisma.serviceBooking.delete({
            where: { id: bookingId }
        })

        // Send email to both parties
        const emails = [booking.customer.email, booking.offer.service.provider.email]
        await Promise.all(emails.map(email => 
            sendEmail({
                to: email,
                subject: "Booking Cancelled",
                text: `The booking for ${booking.offer.service.name} has been cancelled.`,
                html: `
                    <h2>Booking Cancelled</h2>
                    <p>The booking for ${booking.offer.service.name} has been cancelled.</p>
                    <p><strong>Time:</strong> ${getBookingTimeRange(booking.date, booking.time)}</p>
                    <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
                    <p><strong>Location:</strong> ${booking.location || booking.offer.service.defaultLocation}</p>
                `
            })
        ))

        revalidatePath(`/home/services/${booking.offer.serviceId}/my-bookings/${bookingId}`)
        return updatedBooking
    } catch (error) {
        console.error('[CANCEL_BOOKING_ERROR]', error)
        throw new Error("Failed to cancel booking")
    }
}
