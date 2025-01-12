import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { EventDetails } from './_components/event-details'
import { getEventById } from '@/actions/events'
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/back-button'
import EventOptions from './_components/event-options'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ eventId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const eventId = (await params).eventId
 
  const event = await getEventById(eventId)

  if (!event) {
    return {
      title: 'Event not found',
    }
  }
 
  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [
        {
          url: event.images[0],
          width: 800,
          height: 600,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: [event.images[0]],
    }
  }
}

const EventPage = async ({ params }: { params: { eventId: string } }) => {
  const event = await getEventById(params.eventId)

  if (!event) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <EventOptions event={event} />
      </div>

      {/* Content */}
      <div className="w-full px-6">
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
          <EventDetails event={event} />
        </Suspense>
      </div>
    </div>
  )
}

export default EventPage