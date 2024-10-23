import React from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from '@prisma/client'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { DollarSign, Phone, Mail, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ServiceDetailsProps {
  service: {
    id: string
    name: string
    description: string
    price: number
    category: string[]
    images: string[]
    providerId: string,
    provider: User
  }
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  return (
    <Card className="w-full max-w-2xl my-20 mx-2 md:mx-auto shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">{service.name}</CardTitle>
            <CardDescription className="text-lg">
              <div className="flex items-center mt-2">
                <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                <span className="font-semibold text-2xl">{service.price.toFixed(2)}</span>
              </div>
            </CardDescription>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={service.provider.image || undefined} alt={service.provider.name || 'Provider'} />
            <AvatarFallback>{service.provider.name ? service.provider.name[0] : 'P'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{service.provider.name}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{service.provider.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{service.provider.email}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {service.category.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-sm">
              {cat}
            </Badge>
          ))}
        </div>
        <Separator />
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{service.description}</p>
        </div>
        <Separator />
        <div className="px-8 md:px-0">
          <h2 className="text-xl font-semibold mb-4">Service Images</h2>
          <Carousel className="w-full max-w-[75vw]">
            <CarouselContent>
              {service.images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
        <Button>Purchase</Button>
      </CardContent>
    </Card>
  )
}