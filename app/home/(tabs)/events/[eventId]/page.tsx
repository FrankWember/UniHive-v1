import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { EventDetails } from './_components/event-details'
import { AttendeeButton } from './_components/attendee-button'
import { getEventById } from '@/actions/events'
import { Skeleton } from "@/components/ui/skeleton"
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'

const EventPage = async ({ params }: { params: { eventId: string } }) => {
  const event = await getEventById(params.eventId)

  if (!event) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <div className="flex items-center space-x-2">
          <RoleGate allowedRoles={[UserRole.ADMIN]}>
            <Link href={`/home/(tabs)/events/${event.id}/edit`} passHref>
              <Button variant="outline" size="sm">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Event
              </Button>
            </Link>
          </RoleGate>
          <Suspense fallback={<Skeleton className="w-24 h-10" />}>
            <AttendeeButton eventId={event.id} />
          </Suspense>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mt-20 px-6">
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
          <EventDetails event={event} />
        </Suspense>
      </div>
    </div>
  )
}

export default EventPage