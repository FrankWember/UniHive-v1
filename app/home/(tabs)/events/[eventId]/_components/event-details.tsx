import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from 'next/image'
import { CalendarIcon, MapPinIcon, UserIcon, Users } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

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
    <Card className="w-full max-w-4xl my-20 mx-2 md:mx-auto shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
            <CardDescription className="text-lg">
              <div className="flex items-center mt-2">
                <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Organized by: {event.creator.name || 'Unknown'}</span>
              </div>
            </CardDescription>
          </div>
          <Badge className="text-lg px-3 py-1">{event.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="px-4 md:px-0">
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent>
              {event.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative">
                    <Image
                      src={image}
                      alt={`Event image ${index + 1}`}
                      height={300}
                      width={300}
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span>{new Date(event.dateTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <Separator />
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Attendees ({event.attendees.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {event.attendees.map((attendee) => (
              <Avatar key={attendee.id} className="h-10 w-10">
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