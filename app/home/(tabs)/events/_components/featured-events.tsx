import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getFeaturedEvents } from "@/actions/events"
import Link from 'next/link'

export const FeaturedEvents = async () => {
  const events = await getFeaturedEvents()

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{new Date(event.dateTime).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/home/(tabs)/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}