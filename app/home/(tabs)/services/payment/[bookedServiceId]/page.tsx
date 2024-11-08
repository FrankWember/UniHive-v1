import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getBookedServiceById } from '@/actions/service-bookings'
import { currentUser } from '@/lib/auth'
import { PaymentForm } from './_components/payment-form'
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/back-button'

export default async function PaymentPage({ params }: { params: { bookedServiceId: string } }) {
  const user = await currentUser()
  if (!user) return notFound()

  const bookedService = await getBookedServiceById(params.bookedServiceId)
  if (!bookedService) return notFound()

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-start h-16 w-full gap-2 border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold truncate">{bookedService.service.name}</h1>
      </div>

      {/* Content */}
      <div className="flex mx-auto px-4 mt-24 mb-24">
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
            <PaymentForm bookedService={bookedService} userId={user.id!} />
        </Suspense>
      </div>
    </div>
  )
}