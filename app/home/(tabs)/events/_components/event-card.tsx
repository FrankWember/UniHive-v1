import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from 'next/image'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    type: string
    images: string[]
    dateTime: Date
    location: string
  }
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{new Date(event.dateTime).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {event.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Image
                    src={image}
                    alt={`Event image ${index + 1}`}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-48"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="p-6">
          <p className="line-clamp-3">{event.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{event.location}</span>
        <Button asChild>
          <Link href={`/home/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}