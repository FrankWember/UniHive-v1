import React from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceDetailsProps {
  service: {
    id: string
    name: string
    description: string
    price: number
    category: string[]
    images: string[]
    providerId: string
  }
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>Provided by: {service.providerId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {service.category.map((cat) => (
            <Badge key={cat} variant="secondary">
              {cat}
            </Badge>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-lg">{service.description}</p>
        </div>
        <div className="mb-4">
          <p className="text-xl font-bold">Price: ${service.price.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {service.images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image}
                alt={`${service.name} image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}