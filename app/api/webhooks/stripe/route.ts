import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/connection'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await prisma.subscription.upsert({
          where: { userId: subscription.metadata.user_id },
          update: {
            status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
            paymentMethod: 'STRIPE',
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
          },
          create: {
            userId: subscription.metadata.user_id,
            status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
            paymentMethod: 'STRIPE',
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await prisma.subscription.update({
          where: { userId: deletedSubscription.metadata.user_id },
          data: {
            status: 'CANCELLED',
            endDate: new Date(),
          },
        })
        break
      // Add more cases as needed
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing Stripe webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}