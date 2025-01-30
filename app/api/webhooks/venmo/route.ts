import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/connection'
import crypto from 'crypto'


const VENMO_WEBHOOK_SECRET = process.env.VENMO_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('venmo-signature')

  // Verify the webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', VENMO_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  try {
    switch (event.type) {
      case 'payment.created':
        if (event.data.recurring) {
          await prisma.subscription.upsert({
            where: { userId: event.data.metadata.user_id },
            update: {
              status: 'ACTIVE',
              paymentMethod: 'VENMO',
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
            create: {
              userId: event.data.metadata.user_id,
              status: 'ACTIVE',
              paymentMethod: 'VENMO',
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
          })
        }
        break
      case 'payment.cancelled':
        if (event.data.recurring) {
          await prisma.subscription.update({
            where: { userId: event.data.metadata.user_id },
            data: {
              status: 'CANCELLED',
              endDate: new Date(),
            },
          })
        }
        break
      // Add more cases as needed
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing Venmo webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}