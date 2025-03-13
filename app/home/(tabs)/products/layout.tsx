import { ProductsProvider } from '@/contexts/products-context'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "products",
    description: "Bring your Campus products to the next level with DormBiz.",
    openGraph: {
      title: "DormBiz Products",
      description: "Bring your Campus products to the next level with DormBiz.",
      images: ["https://m4bzgt0vjx.ufs.sh/f/nYBT8PFt8ZHfMUoWNQlvYm2rFdR45xgNI7D1thwaiZzufosb"]
    },
    twitter: {
      title: "DormBiz Products",
      description: "Bring your Campus products to the next level with DormBiz.",
      card: "summary_large_image",
      images: ["https://m4bzgt0vjx.ufs.sh/f/nYBT8PFt8ZHfMUoWNQlvYm2rFdR45xgNI7D1thwaiZzufosb"]
    }
  };

const productsLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <ProductsProvider>
        {children}
    </ProductsProvider>
  )
}

export default productsLayout