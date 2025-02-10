import React from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedEvents } from './_components/matched-events'
import { EventsProvider } from '@/contexts/events-context'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Events",
  description: "Events on Unihive",
  openGraph: {
    title: "Events",
    description: "Events on Unihive",
    images: ["https://m4bzgt0vjx.ufs.sh/f/nYBT8PFt8ZHfMUoWNQlvYm2rFdR45xgNI7D1thwaiZzufosb"]
  },
  twitter: {
    title: "Events",
    description: "Events on Unihive",
    card: "summary_large_image",
    images: ["https://m4bzgt0vjx.ufs.sh/f/nYBT8PFt8ZHfMUoWNQlvYm2rFdR45xgNI7D1thwaiZzufosb"]
  }
}

const EventsPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <EventsProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Events</h1>
          <div className="flex items-center space-x-3">
            <SearchBar />
            <SideMenu />
          </div>
        </div>

        {/* Content */}
        <div className="w-full mt-20">
          <MatchedEvents searchParams={searchParams} />
        </div>
      </div>
    </EventsProvider>
  )
}

export default EventsPage