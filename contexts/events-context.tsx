"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAllEvents } from '@/actions/events'

type Event = {
  id: string
  title: string
  description: string
  creatorId: string
  creator: {
    id: string
    name: string|null
  }
  type: string
}

type EventsContextType = {
  events: Event[]
  isLoading: boolean
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getAllEvents()
      setEvents(fetchedEvents)
      setIsLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <EventsContext.Provider value={{ events, isLoading }}>
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
}