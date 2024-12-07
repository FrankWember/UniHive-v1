"use server"

import { prisma } from "@/prisma/connection"
import { revalidatePath } from "next/cache"
import { currentUser } from "@/lib/auth"
import { ServiceOfferSchema } from "@/constants/zod"
import * as z from "zod"
import { sendEmail } from "@/lib/mail"

export async function addServiceOffer (serviceId: string, values: z.infer<typeof ServiceOfferSchema>) {
    await prisma.serviceOffer.create({
        data: {
            ...values,
            serviceId
        }
    })

    revalidatePath(`/home/services/${serviceId}`)
}

export async function updateServiceOffer (offerId: string, values: z.infer<typeof ServiceOfferSchema>) {
    const offer = await prisma.serviceOffer.update({
        where: {
            id: offerId
        },
        data: {
            ...values,
        }
    })

    revalidatePath(`/home/services/${offer.serviceId}`)
}

export async function deleteServiceOffer (offerId: string) {
    const offer = await prisma.serviceOffer.delete({
        where: {
            id: offerId
        }
    })

    revalidatePath(`/home/services/${offer.serviceId}`)
}