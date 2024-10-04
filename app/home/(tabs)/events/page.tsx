import React, { Suspense } from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedEvents } from './_components/matched-events'
import { Skeleton } from "@/components/ui/skeleton"

const EventsPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
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
      <div className="w-full mt-20 space-y-8 px-6">
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
          <MatchedEvents searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default EventsPage