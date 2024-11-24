import React, { Suspense } from 'react'
import { SearchBar } from './_components/product-search'
import { SideMenu } from './_components/side-menu'
import { ProductList } from './_components/product-list'
import { ProductsProvider } from '@/contexts/products-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const ProductsPage = () => {
  return (
    <ProductsProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex items-center space-x-3">
            <SearchBar />
            <Link href={`/home/products/cart`}>
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <SideMenu />
          </div>
        </div>

        {/* Content */}
        <div className="w-full mt-24 pb-24">
          <Suspense fallback={(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
            </div>
          )}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </ProductsProvider>
  )
}

export default ProductsPage