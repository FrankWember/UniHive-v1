"use client"

import { Product } from '@prisma/client'
import { ProductCard } from './product-card'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/contexts/products-context'
import { Skeleton } from '@/components/ui/skeleton'

export async function ProductList() {
  const searchParams = useSearchParams()
  const { products, isLoading } = useProducts()
  const category = searchParams.get('category')

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-6 mx-3 md:mx-10">
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
        <Skeleton className="w-full h-48"/>
      </div>
    )
  }

  if (products.length === 0) {
    return <div>No products found.</div>
  }

  const filteredProducts = category
    ? products.filter((product) => product.categories.includes(category))
    : products

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-3 md:gap-6 mx-3 md:mx-10">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}