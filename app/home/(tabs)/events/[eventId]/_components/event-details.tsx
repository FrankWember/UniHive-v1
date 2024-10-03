import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'

interface EventDetailsProps {
  event: {
    id: string
    title: string
    description: string
    dateTime: Date
    location: string
    creator: {
      id: string
      name: string | null
    }
    attendees: {
      id: string
      eventId: string
      userId: string
      user: {
        id: string
        name: string | null
        image: string | null
      }
    }[]
    images: string[]
  }
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>Organized by: {event.creator.name || 'Unknown'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>{new Date(event.dateTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        <p className="text-lg">{event.description}</p>
        {event.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {event.images.map((image, index) => (
              <Image key={index} src={image} alt={`Event image ${index + 1}`} className="rounded-md object-cover w-full h-48" fill/>
            ))}
          </div>
        )}
        <div>
          <h3 className="font-semibold mb-2">Attendees ({event.attendees.length})</h3>
          <div className="flex flex-wrap gap-2">
            {event.attendees.map((attendee) => (
              <Avatar key={attendee.id}>
                <AvatarImage src={attendee.user.image || undefined} alt={attendee.user.name || 'Attendee'} />
                <AvatarFallback>{attendee.user.name ? attendee.user.name.charAt(0) : 'A'}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}