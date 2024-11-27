"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductReview } from '@prisma/client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { addItemToCart } from '@/actions/cart'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product & { reviews: ProductReview[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const callbackUrl = encodeURIComponent(`/home/products/${product.id}`)

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0

    const addToCart = async () => {
      try {
        setIsSubmitting(true)
        if (!user) {
          router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
          return
        }
        await addItemToCart(product, user!.id!)
      } catch (error) {
        console.error('Error adding item to cart:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <Link href={`/home/products/${product.id}`}>
      <Card className="flex flex-col bg-neutral-50 dark:bg-neutral-900 shadow-sm border-none">
        <div className="relative w-full min-h-48 h-full">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base mb-2">{product.name}</h3>
          <div className="flex items-center space-x-3">
            <div className="text-base font-semibold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              ({product.reviews.length})
            </div>
          </div>
          <div className="flex justify-between">
            {product.discount>0 ? (
              <div className='flex items-center space-x-2'>
                <p className="font-bold text-base">${(product.price * (1 - product.discount)).toFixed(2)}</p>
                <span className='text-muted-foreground line-through'>${product.price.toFixed(2)}</span>
              </div>
            ):(
              <p className="text-base font-semibold py-1">${product.price.toFixed(2)}</p>
            )}
            <Button onClick={addToCart} disabled={isSubmitting} className="rounded-full bg-yellow-500 hover:bg-yellow-600" size="icon"><ShoppingCart className="w-4 h-4"/></Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}