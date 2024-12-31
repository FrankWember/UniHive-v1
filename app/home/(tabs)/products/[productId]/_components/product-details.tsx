"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { VerifiedIcon } from '@/components/icons/verified-icon'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Product, User, ProductReview } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { addItemToCart } from '@/actions/cart'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useToast } from '@/hooks/use-toast'
import { ProductInfo } from './product-info'
import { ReviewsSection } from './review-section'
import { calculateProductReviewMetrics } from '@/utils/helpers/reviews'

interface ProductDetailsProps {
  product: Product & {seller: User}
  reviews: (ProductReview & { 
    reviewer: User
  })[]
}

export function ProductDetails({ product, reviews }: ProductDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  

  // Carousel stuff
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const imagesRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const averageRating = calculateProductReviewMetrics(reviews)?.overall
  const ratingCounts = calculateProductReviewMetrics(reviews)?.ratingCount

  const addToCart = async (buyNow?: boolean) => {
    try {
      setIsSubmitting(true)
      await addItemToCart(product, user!.id!)
      toast({
        title: "Product Added to Cart",
        description: `${product.name} has been added to your shopping cart.`,
      })
      setTimeout(() => {
        if (buyNow) router.push("/home/products")
        else router.push("/home/products/cart")
      }, 1000)
    } catch (error) {
      console.error('Error adding item to cart:', error)
      toast({
        title: "An Error Occured!",
        description: "Sorry! We couldn't add the product to your cart. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="w-full m-0 p-0">
          <div className="flex flex-col gap-4 p-0 m-0">
            <div className="px-2 py-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/home/products">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Brand</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/home/products?brand=${product.brand}`}>{product.brand}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/home/products?category=${product.categories[0]}`}>{product.categories[0]}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{product.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex gap-4 py-1 px-4 items-center">
              <Avatar className="h-10 w-10">
                  <AvatarImage src={product.seller.image || undefined} alt={product.seller.name || 'provider'} className="object-cover" />
                  <AvatarFallback>{product.seller.name ? product.seller.name[0] : 'S'}</AvatarFallback>
              </Avatar>
                <span className="flex items-center justify-start text-lg font-semibold gap-1">
                    {product.seller.name}
                    <VerifiedIcon className="h-4 w-4" />
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {product.images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="aspect-square relative w-full">
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
                    <div className="absolute bottom-8 right-14 flex items-center gap-2">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
                <div className="py-1 text-center text-sm text-muted-foreground">
                    Image {current} of {count}
                </div>
            </div>
            <div className="flex flex-col px-2 py-4 gap-4">
              <ProductInfo product={product} addToCart={addToCart} />
              <ReviewsSection 
                averageRating={averageRating!} 
                ratingCounts={ratingCounts!} 
                reviews={reviews} 
                productId={product.id}
              />
            </div>
          </div>
      </div>
    )
  }

  // Desktop View
  return (
    <div className='flex flex-col w-full max-w-6xl min-h-screen px-10 space-y-3'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home/products">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/home/products?brand=${product.brand}`}>{product.brand}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/home/products?category=${product.categories[0]}`}>{product.categories[0]}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-2 w-full justify-center mt-5 gap-8'>
        <div ref={imagesRef} className='sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto'>
          <div className='flex flex-col items-center gap-4'>
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={product.name}
                width={1000}
                height={1000}
                className='w-full h-auto rounded-lg object-cover'
              />
            ))}
          </div>
        </div>
        <div ref={infoRef} className='flex flex-col items-start space-y-3'>
          <div className='sticky top-4'>
            <ProductInfo product={product} addToCart={addToCart} />
          </div>
        </div>
      </div>

      <div className='w-full mt-8'>
        <ReviewsSection 
          averageRating={averageRating!} 
          ratingCounts={ratingCounts!} 
          reviews={reviews} 
          productId={product.id}
        />
      </div>
    </div>
  )
}

