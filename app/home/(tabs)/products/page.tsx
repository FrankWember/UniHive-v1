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
    { name: "Men's Wear", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfWZI6bikI8zCJONi0axTRgfKEPehZnwcSsAuq" },
    { name: "Women's Wear", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfKWL2ZKSRr8bpUxL1QFcoq0HazduW4jvfiDE5" },
    { name: "Kid's Wear", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfupRIEv5zaec0hdgxYLBRviOZJpWsfl3yFIQS" },
    { name: "Sneakers", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfzDWu6WMrY3pvhLVm8abPjn9fQKTsgtkIDoFq" },
    { name: "Electronics", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfemncMwHO0No5ZUKEIDvPdJxqznT7mbFLGMg3" },
    { name: "Smartphones", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfe6Fs84HO0No5ZUKEIDvPdJxqznT7mbFLGMg3" },
    { name: "Gadgets", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfot9pkOEzBwVpdJ9eikGyRDX07grIsH26W3AE"},
    { name: "Gaming", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf1T9zhL7pxSQ4XBcOsmzAE8tRkUCqKDpoLigl" },
    { name: "Furniture", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfFHKw4mUz45IQBCgG7W2Zb9jtfNhOxMu1RY8A" },
    { name: "Cosmetics", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfMbubBXxlvYm2rFdR45xgNI7D1thwaiZzufos" },
    { name: "Automobile", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfV4HJcSDLK2EmsTAbnRtquWD8lZ5XC4YFSz7Q" },
    { name: "Photography", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf9xNComcLY7iGPOM8TNVJkEvgjyqaZCdRF6l0" },
    { name: "Food", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfigCCPp0pbd1aFvt4ISVrmWQAcjyho7wY3kUu" },
    { name: "Music", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf7AgC0cKSg1j6dPWpUOurM8zwZ3obleVTaIEm" },
    { name: "Art", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHfjkIj5PyLgKAhD7q1W4Vb92m3fU6i0zvFPByS" },
    { name: "Fashion", imageUrl: "https://utfs.io/f/nYBT8PFt8ZHf7Bnq4tSg1j6dPWpUOurM8zwZ3obleVTaIEmQ" },
  ]

  return (
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <div className="flex justify-start items-center gap-3">
              <Link href="/home/products">
                <Image src="/DormBiz.png" alt="logo" width={50} height={50} className="rounded-md border" />
              </Link>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar />
            {user ? (
              <Link href={`/home/products/cart`}>
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

        {/* Categories */}
        <div>
        <ScrollArea className="w-screen h-36 md:h-40 whitespace-nowrap mt-24 px-4 md:px-8">
          <div className='flex items-center w-max gap-8 md:gap-12 p-4 '>
            <div className="flex flex-col gap-2">
              <Link href={`/home/products`}>
              <div className="flex justify-center items-center rounded-full h-20 w-20 md:h-24 md:w-24 bg-muted">
                <ArrowDownAZ className='h-12 w-12' />
              </div>
              </Link>
              <h2 className='text-sm md:text-base font-semibold text-center'>All</h2>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/home/products/favourites`}>
                <div className="flex justify-center items-center rounded-full h-20 w-20 md:h-24 md:w-24 bg-muted">
                  <Heart className='h-12 w-12' />
                </div>
              </Link>
              <h2 className='text-sm md:text-base font-semibold text-center'>Favourites</h2>
            </div>
            {categories.map((category) => (
              <Link key={category.name} href={`/home/products?category=${category.name.toLocaleLowerCase()}`}>
                <div className='flex flex-col gap-2'>
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={category.imageUrl} className='object-cover'/>
                    <AvatarFallback>{category.name[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className='text-sm md:text-base font-semibold text-center'>{category.name}</h2>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className='hidden' />
        </ScrollArea>
      </div>

        {/* Content */}
        <div className="w-full pb-24">
            <ProductList />
        </div>
      </div>
  )
}

export default ProductsPage