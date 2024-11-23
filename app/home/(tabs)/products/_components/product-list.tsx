"use client"

import { Product } from '@prisma/client'
import { ProductCard } from './product-card'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/contexts/products-context'

export async function ProductList() {
  const searchParams = useSearchParams()
  const { products, isLoading } = useProducts()
  const category = searchParams.get('category')

  if (products.length === 0) {
    return <div>No products found.</div>
  }

  const filteredProducts = category
    ? products.filter((product) => product.categories.includes(category))
    : products

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}