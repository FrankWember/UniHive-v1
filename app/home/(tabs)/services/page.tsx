import React from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedServices } from './_components/matched-services'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowDownAZ, Heart, ShoppingCart } from 'lucide-react'
import { currentUser } from '@/lib/auth'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

const ServicesPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
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
      {/* Header  */}
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start items-center gap-3">
            <Link href="/home/services">
              <Image src="/Unihive.svg" alt="logo" width={50} height={50} className="rounded-md border" />
            </Link>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar />
          {user && (
            <Link href={`/auth/sign-up`}>
              <Button>
                Join
              </Button>
            </Link>
          )}
          <SideMenu />
        </div>
      </div>

      <Separator />

      <div className='px-4 py-2'>
        <ScrollArea className="w-full h-36 md:h-40 whitespace-nowrap mt-24 px-4 md:px-8 rounded-lg bg-muted">
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

      <Separator />

      {/* Content */}
      <div className="w-full pb-24">
        <MatchedServices searchParams={searchParams} />
      </div>
    </div>
  )
}

export default ServicesPage