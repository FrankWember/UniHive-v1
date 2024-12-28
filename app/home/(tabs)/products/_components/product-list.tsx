"use client"

import { Product } from '@prisma/client'
import { ProductCard } from './product-card'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/contexts/products-context'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'

export function ProductList() {
  const searchParams = useSearchParams()
  const { products, isLoading } = useProducts()
  const category = searchParams.get('category')
  const mine = searchParams.get('mine')
  const favourites = searchParams.get('favourites')
  const brand = searchParams.get('brand')
  const user = useCurrentUser()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-4 md:gap-5 px-3 py-6">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-56 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <div>No products found.</div>
  }

  const filteredProducts = category
    ? products.filter((product) => product.categories.includes(category) && product.stock > 0)
    : mine && user
    ? products.filter((product) => product.sellerId === mine)
    : favourites && user
    ? products.filter((product) => product.favourites.some((favourite) => favourite.userId === user?.id))
    : brand 
    ? products.filter((product) => product.brand === brand)
    : products

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 gap-y-4 md:gap-5 px-3 py-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}