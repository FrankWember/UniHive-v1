"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductReview } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { addItemToCart } from '@/actions/cart'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product & { reviews: ProductReview[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const callbackUrl = encodeURIComponent(`/home/products/${product.id}`)
  const {toast} = useToast()

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
        if (product.stock === 0) {
          toast({
            title: "Product Out of Stock",
            description: `${product.name} is currently out of stock.`,
            variant: "destructive"
          })
          router.push("/home/products")
          return
        }
        await addItemToCart(product, user!.id!)
        toast({
          title: "Product Added to Cart",
          description: `${product.name} has been added to your shopping cart.`,
        })
        router.push("/home/products/cart")
      } catch (error) {
        console.error('Error adding item to cart:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <Link href={`/home/products/${product.id}`}>
      <div className="flex flex-col gap-2 border-none">
        <div className="relative w-full min-h-48 h-full">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="p-2">
          <div className="flex justify-between">
            {product.discount>0 ? (
              <div className='flex items-center space-x-2'>
                <p className="font-bold text-base">${(product.price - (product.price * (product.discount || 0) / 100)).toFixed(2)}</p>
                <span className='text-muted-foreground line-through text-sm'>${product.price.toFixed(2)}</span>
              </div>
            ):((
              <p className="text-base font-semibold py-1">${product.price.toFixed(2)}</p>
            ))}
          </div>
          <h3 className="text-base">{product.name}</h3>
        </div>
      </div>
    </Link>
  )
}