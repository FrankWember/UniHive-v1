import { PaymentMethod, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/prisma/connection";
import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

export async function upsertSubscription({ 
    userId, 
    paymentMethod,
    subscriptionPlan='STANDARD',
    subscriptionStatus='ACTIVE',
    monthlyAmount=30
}: {
    userId: string, 
    paymentMethod: PaymentMethod 
    subscriptionPlan?: SubscriptionPlan
    subscriptionStatus?: SubscriptionStatus
    monthlyAmount?: number
}) {
    try {
        

        const subscription = await prisma.subscription.upsert({
            where: { userId: userId },
            update: {
                status: 'ACTIVE',
                paymentMethod: paymentMethod,
                plan: subscriptionPlan,
                monthlyAmount: monthlyAmount,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
            create: {
                userId: userId,
                status: 'ACTIVE',
                paymentMethod: paymentMethod, 
                plan: subscriptionPlan,
                monthlyAmount: monthlyAmount,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
        })

        return subscription
    } catch (error) {
        console.log(
            `[Subscription Error]`,
            `Subscription failed for user with ID ${userId}`,
            'with error:',
            error
        )
        return null
    }
}