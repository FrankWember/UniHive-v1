import React, { Suspense } from 'react'
import { SearchBar } from './_components/product-search'
import { SideMenu } from './_components/side-menu'
import { ProductList } from './_components/product-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowDownAZ, Heart, ShoppingCart } from 'lucide-react'
import { getCartItemsNumber } from '@/utils/data/cart'
import Image from 'next/image'
import { currentUser } from '@/lib/auth'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const ProductsPage = async() => {
  const number_of_items = await getCartItemsNumber()
  const user = await currentUser()

  const categories = [
    { name: "Barber", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfcerw5XdrfsMIYNHzSRKQD4XWgdmV3pCnha0b" },
    { name: "Braiding", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf1uLQULpxSQ4XBcOsmzAE8tRkUCqKDpoLiglJ" },
    { name: "Electronics", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfemncMwHO0No5ZUKEIDvPdJxqznT7mbFLGMg3" },
    { name: "Makeup", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfMbubBXxlvYm2rFdR45xgNI7D1thwaiZzufos" },
    { name: "Nails", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfYRA1s04HdjsfxSoUO07KrDbPi1JtFCmhWlIB" },
    { name: "Housing", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHftUF1nkLhGknyo7LpxjlzH8Q5gXAVMUfO0W29" },
    { name: "Tutoring", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf7C9FKRSg1j6dPWpUOurM8zwZ3obleVTaIEmQ" },
    { name: "Automobile", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfV4HJcSDLK2EmsTAbnRtquWD8lZ5XC4YFSz7Q" },
    { name: "Photography", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf9xNComcLY7iGPOM8TNVJkEvgjyqaZCdRF6l0" },
    { name: "Tailoring", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfwg2m0tNkDTtpcZYv0Ad284yreLKoaWfnuS6l" },
    { name: "Cooking", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfigCCPp0pbd1aFvt4ISVrmWQAcjyho7wY3kUu" },
    { name: "Massage", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf9nJCG2xcLY7iGPOM8TNVJkEvgjyqaZCdRF6l" },
    { name: "Cleaning", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfpaiYeTmFEcB1VQvWRSfJTUZKi6h2Ns8wqIYL" },
    { name: "Graphic Design", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfdUy1wasny0Pftj692TKE4nuIRbzsFrHwlxYc" },
    { name: "Music", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf7AgC0cKSg1j6dPWpUOurM8zwZ3obleVTaIEm" },
  ]

  return (
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <div className="flex justify-start items-center gap-3">
              <Link href="/home/services">
                <Image src="/Unihive.svg" alt="logo" width={50} height={50} className="rounded-md border" />
              </Link>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar />
            {user ? (
              <Link href={`/home/services/cart`}>
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute top-2 right-16 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                    {number_of_items}
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href={`/auth/sign-up`}>
                <Button>
                  Join
                </Button>
              </Link>
            )}
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
  )
}

export default ProductsPage