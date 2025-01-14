"use client"

import { useState, useEffect } from 'react'
import { ProductCard } from '../../../_components/product-card'
import { Product, User, ProductReview } from '@prisma/client'

interface SellerProductsProps {
  seller: User & {products: (Product & { reviews: ProductReview[] })[]}
}

export function SellerProducts({ seller }: SellerProductsProps) {

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products by this Seller</h2>
      <div className="grid grid-cols-2  lg:grid-cols-3 gap-6 md:overflow-y-auto md:max-h-[90vh]">
        {seller.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {seller.products.length === 0 && (
        <p className="text-center text-muted-foreground">This seller has no products yet.</p>
      )}
    </div>
  )
}