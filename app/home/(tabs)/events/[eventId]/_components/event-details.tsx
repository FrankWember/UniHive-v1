import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "@radix-ui/react-icons"
import { MapPinIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from 'next/image'

interface EventDetailsProps {
  event: {
    id: string
    title: string
    description: string
    type: string
    images: string[]
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
        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {event.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Image
                    src={image}
                    alt={`Event image ${index + 1}`}
                    width={600}
                    height={400}
                    className="rounded-md object-cover w-full h-64"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>{new Date(event.dateTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        <Badge>{event.type}</Badge>
        <p className="text-lg">{event.description}</p>
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