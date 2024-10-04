import React from 'react'
import { getMatchedEvents } from "@/actions/events"
import { EventCard } from './event-card'

interface MatchedEventsProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const MatchedEvents: React.FC<MatchedEventsProps> = async ({ searchParams }) => {
  const events = await getMatchedEvents(searchParams)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}