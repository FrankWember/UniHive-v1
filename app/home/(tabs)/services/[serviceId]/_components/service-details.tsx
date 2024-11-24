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
import Link from 'next/link'

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
    <Card className="w-full max-w-2xl md:mx-auto p-6 shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">{service.name}</CardTitle>
            <CardDescription className="text-lg">
              <div className="flex items-center mt-2">
              <span className="text-green-500 mr-1">$</span>
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
          <Badge variant="success">Account Verified</Badge>
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
        <div className="flex flex-col justifuy-center px-8 md:px-0 pb-8">
          <h2 className="text-xl font-semibold mb-4">Service Images</h2>
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              {service.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative">
                    <Image
                      src={image}
                      alt={`${service.name} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-8 right-14 flex gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
        <Link href={`/home/services/${service.id}/book`} className="mt-8">
          <Button>Purchase</Button>
        </Link>
      </CardContent>
    </Card>
  )
}