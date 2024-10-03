import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getEventById } from '@/actions/events'
import { Skeleton } from "@/components/ui/skeleton"
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'
import { EditEventForm } from './_components/edit-event-form'

const EditEventPage = async ({ params }: { params: { eventId: string } }) => {
  const event = await getEventById(params.eventId)

  if (!event) {
    notFound()
  }

  return (
    <RoleGate allowedRoles={[UserRole.ADMIN]}>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Edit Event: {event.title}</h1>
        </div>

        {/* Content */}
        <div className="w-full mt-20 px-6">
          <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <EditEventForm event={event} />
          </Suspense>
        </div>
      </div>
    </RoleGate>
  )
}

export default EditEventPage