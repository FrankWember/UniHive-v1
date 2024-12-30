"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { VerifiedIcon } from '@/components/icons/verified-icon'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductRequest } from './product-request'
import { Product, User, ProductReview } from '@prisma/client'
import { updateProductReview, makeProductReview } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { addItemToCart } from '@/actions/cart'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useToast } from '@/hooks/use-toast'
import { ProductInfo } from './product-info'
import { ReviewsSection } from './review-section'

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

  const my_review = reviews.find(review => review.reviewer.id === user?.id)
  const [newReview, setNewReview] = useState({rating: my_review?.rating || 0, comment: my_review?.comment || '' })

  // Image stuff
  const [currentImgIndex, setCurrentImageIndex] = useState(0)

  // Carousel stuff
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const handleSubmitReview = async () => {
    setIsSubmitting(true)
    if (!user) {
      const callbackUrl = encodeURIComponent(`/home/products/${product.id}`)
      router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
      return
    }
    if (!my_review) {
      await makeProductReview(product.id, newReview.rating, newReview.comment, user!.id!)
    } else {
      await updateProductReview(my_review.id, newReview.rating, newReview.comment)
    }
    router.push(`/home/products/${product.id}`)
    setIsSubmitting(false)
  }

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
                averageRating={averageRating} 
                ratingCounts={ratingCounts} 
                reviews={reviews} 
                newReview={newReview} 
                setNewReview={setNewReview} 
                isSubmitting={isSubmitting} 
                handleSubmitReview={handleSubmitReview}
              />
            </div>
          </div>
      </div>
    )
    
  }

  // Desktop View
  return (
    <div className='flex flex-col w-full max-w-6xl min-h-screen h-full px-10 space-y-3 overflow-hidden'>
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

      <div className='grid grid-cols-2 w-full justify-center mt-5 gap-8'>
        <div className='flex flex-col items-center gap-4'>
          {product.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={product.name}
              width={1000}
              height={1000}
              className='w-full h-full rounded-lg object-cover'
            />
          ))}
        </div>
        <div className='flex flex-col items-center space-y-3'>
          <ProductInfo product={product} addToCart={addToCart} />
        </div>
      </div>

      {/* Review Section */}
      <div className='w-full'>
        <ReviewsSection 
            averageRating={averageRating} 
            ratingCounts={ratingCounts} 
            reviews={reviews} 
            newReview={newReview} 
            setNewReview={setNewReview} 
            isSubmitting={isSubmitting} 
            handleSubmitReview={handleSubmitReview}
          />
      </div>

    </div>
  )
}

