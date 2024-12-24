import { ProductsProvider } from '@/contexts/products-context'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Unihive | products",
    description: "Bring your Campus products to the next level with Unihive.",
  };

const productsLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <ProductsProvider>
        {children}
    </ProductsProvider>
  )
}

export default productsLayout