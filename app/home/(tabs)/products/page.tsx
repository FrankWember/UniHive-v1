import React, { Suspense } from 'react'
import { SearchBar } from './_components/product-search'
import { SideMenu } from './_components/side-menu'
import { ProductList } from './_components/product-list'
import { ProductsProvider } from '@/contexts/products-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { getCartItemsNumber } from '@/utils/data/cart'

const ProductsPage = async() => {
  const number_of_items = await getCartItemsNumber()
  return (
    <ProductsProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex items-center space-x-3">
            <SearchBar />
            <Link href="/home/products/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {number_of_items > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {number_of_items}
                  </span>
                )}
              </Button>
            </Link>
            <SideMenu />
          </div>
        </div>

        {/* Content */}
        <div className="w-full mt-24 pb-24">
          <Suspense>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </ProductsProvider>
  )
}

export default ProductsPage