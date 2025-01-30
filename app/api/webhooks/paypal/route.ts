import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/connection'
import crypto from 'crypto'



const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('paypal-transmission-sig')
  const transmissionId = req.headers.get('paypal-transmission-id')
  const timestamp = req.headers.get('paypal-transmission-time')

  // Verify the webhook signature
  const verifySignature = (transmissionId: string, timestamp: string, webhookId: string, eventBody: string) => {
    const expectedSignature = crypto
      .createHmac('sha256', PAYPAL_WEBHOOK_ID)
      .update(`${transmissionId}|${timestamp}|${webhookId}|${crypto.createHash('sha256').update(eventBody).digest('hex')}`)
      .digest('base64')
    return expectedSignature === signature
  }

  if (!verifySignature(transmissionId!, timestamp!, PAYPAL_WEBHOOK_ID, body)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  try {
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await prisma.subscription.upsert({
          where: { userId: event.resource.custom_id },
          update: {
            status: 'ACTIVE',
            paymentMethod: 'PAYPAL',
            startDate: new Date(event.resource.start_time),
            endDate: new Date(event.resource.billing_info.next_billing_time),
          },
          create: {
            userId: event.resource.custom_id,
            status: 'ACTIVE',
            paymentMethod: 'PAYPAL',
            startDate: new Date(event.resource.start_time),
            endDate: new Date(event.resource.billing_info.next_billing_time),
          },
        })
        break
      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await prisma.subscription.update({
          where: { userId: event.resource.custom_id },
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
    console.error('Error processing PayPal webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}