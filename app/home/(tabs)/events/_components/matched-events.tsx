import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMatchedEvents } from "@/actions/events"
import Link from 'next/link'

interface MatchedEventsProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const MatchedEvents: React.FC<MatchedEventsProps> = async ({ searchParams }) => {
  const events = await getMatchedEvents(searchParams)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{new Date(event.dateTime).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{event.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/home/(tabs)/events/${event.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}