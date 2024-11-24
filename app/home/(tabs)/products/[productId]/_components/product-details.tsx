"use client"

import { Product, User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PersonIcon } from '@radix-ui/react-icons'

interface ProductDetailsProps {
  product: Product & { seller: User }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const addToMyCart = async () => {
    console.log("Added to cart:", product.name)
  }

  return (
    <Card className="w-full max-w-2xl md:mx-auto shadow-lg">
      <CardContent className="flex flex-col space-y-6 p-6">
        <div className="flex flex-row gap-8">
          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold">{product.name}</h2>
            </div>
            <div className="flex items-center justify-start gap-6">
              <span className="text-2xl font-bold"><span className="text-green-500 mr-1">$</span>{product.price.toFixed(2)}</span>
              <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
            <div className="flex gap-2 items-center justify-start text-muted-foreground">
              <PersonIcon />
              <span>{product.seller.name}</span>
            </div>
            <Badge variant="success">Account Verified</Badge>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={product.seller.image || undefined} alt={product.seller.name || 'Seller'} />
              <AvatarFallback>{product.seller.name ? product.seller.name[0] : 'S'}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator />

        {/* Product Description */}
        <div className="flex flex-col justify-center px-8 md:px-0">
          <h2 className="text-xl font-semibold mb-4">Product Description</h2>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        <Separator />

        {/* Product Images */}
        <div className="flex flex-col justify-center px-8 md:px-0">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <Carousel className="w-full mx-auto">
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
            <div className="absolute bottom-8 right-14 flex gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <Separator />
        
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Purchase</h2>
          <p className="text-muted-foreground mb-2">
            You can have a discussion with the seller in the chat and make requests to get a discount on the product. Or simply add to cart
          </p>
          <Button>Request Discount</Button>
          <div className="flex gap-1 text-muted-foreground">
            <Separator />
            <span>or</span>
            <Separator />
          </div>
          <Button onClick={addToMyCart}>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  )
}