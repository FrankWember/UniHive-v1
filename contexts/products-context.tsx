"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  categories: string[]
  stock: number
  images: string[]
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  sellerId: string
  seller: {
    id: string,
    name: string
  }
}

type ProductsContextType = {
  products: Product[]
  isLoading: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Replace with actual API call once implemented
        const response = await fetch('/api/products')
        const fetchedProducts = await response.json()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
