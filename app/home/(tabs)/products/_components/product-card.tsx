"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductReview } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { addItemToCart } from '@/actions/cart'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { likeProduct } from '@/actions/products'

interface ProductCardProps {
  product: Product & { reviews: ProductReview[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const callbackUrl = encodeURIComponent(`/home/products/${product.id}`)
  const {toast} = useToast()

  React.useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/favourites`)
        const data = await response.json()
        setIsLiked(data.isLiked)
      } catch (error) {
        console.error('Error fetching like status:', error)
      }
    }

    fetchLikeStatus()
  }, [])

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

    async function likeThisProduct() {
      if (!user) {
        toast({
            title: 'Please log in to like a service',
            description: 'You need to be logged in to like a service.',
        })
        return
      }
      const like = await likeProduct(product.id)
      setIsLiked(like)
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
          <Button className='absolute bottom-2 right-4 hover:bg-transparent/60 bg-transparent' variant="ghost" size="icon" onClick={likeThisProduct}>
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none'}`}/>
          </Button>
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