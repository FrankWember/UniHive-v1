import React from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedServices } from './_components/matched-services'
import { ServicesProvider } from '@/contexts/services-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowDownAZ, Heart, ShoppingCart } from 'lucide-react'
import { currentUser } from '@/lib/auth'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'

const ServicesPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const user = await currentUser()

  const categories = [
    { name: "Barber", imageUrl: "/service-categories/barber.svg" },
    { name: "Braiding", imageUrl: "/service-categories/braiding.svg" },
    { name: "Electronics", imageUrl: "/service-categories/electronics.svg" },
    { name: "Beauty", imageUrl: "/service-categories/beauty.svg" },
    { name: "Housing", imageUrl: "/service-categories/housing.svg" },
    { name: "Tutoring", imageUrl: "/service-categories/tutoring.svg" },
    { name: "Automobile", imageUrl: "/service-categories/automobile.svg" },
    { name: "Photography", imageUrl: "/service-categories/photography.svg" }
  ]
  
  return (
    <ServicesProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header  */}
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <div className="flex justify-start items-center gap-3">
              <Link href="/home/services">
                <Image src="/Unihive.svg" alt="logo" width={50} height={50} className="rounded-md border" />
              </Link>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar />
            {user?(
              <Link href={`/home/services/cart`}>
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </Link>
            ):(
              <Link href={`/auth/sign-up`}>
                <Button>
                  Join
                </Button>
              </Link>
            )}
            <SideMenu />
          </div>
        </div>

        <div>
          <ScrollArea className="w-screen h-36 md:h-40 whitespace-nowrap mt-24 px-4 md:px-8">
            <div className='flex items-center w-max gap-8 md:gap-12 p-4 '>
              <div className="flex flex-col gap-2">
                <Link href={`/home/services`}>
                <div className="flex justify-center items-center rounded-full h-20 w-20 md:h-24 md:w-24 bg-muted">
                  <ArrowDownAZ className='h-12 w-12' />
                </div>
                </Link>
                <h2 className='text-sm md:text-base font-semibold text-center'>All</h2>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/home/services?favourites=true`}>
                  <div className="flex justify-center items-center rounded-full h-20 w-20 md:h-24 md:w-24 bg-muted">
                    <Heart className='h-12 w-12' />
                  </div>
                </Link>
                <h2 className='text-sm md:text-base font-semibold text-center'>Favourites</h2>
              </div>
              {categories.map((category) => (
                <Link key={category.name} href={`/home/services?category=${category.name.toLocaleLowerCase()}`}>
                  <div className='flex flex-col gap-2'>
                    <Avatar className="h-20 w-20 md:h-24 md:w-24">
                      <AvatarImage src={category.imageUrl} />
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
          <MatchedServices searchParams={searchParams} />
        </div>
      </div>
    </ServicesProvider>
  )
}

export default ServicesPage