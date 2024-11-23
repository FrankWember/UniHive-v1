"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <Card>
      <CardContent className="p-6">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative">
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="mt-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {product.categories.map((category) => (
              <Badge key={category} variant="secondary">{category}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}