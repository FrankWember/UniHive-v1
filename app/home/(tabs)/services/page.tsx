import React from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedServices } from './_components/matched-services'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowDownAZ, Heart, Pencil, ShoppingCart } from 'lucide-react'
import { currentUser } from '@/lib/auth'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Scissors, Brush, Laptop, Home, BookOpen, Car, Camera, PencilRuler, ChefHat, Hand, WashingMachine, Palette, Music } from 'lucide-react';

const ServicesPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const user = await currentUser()

  const categories = [
    { name: "Barber", icon: Scissors },
    { name: "Braiding", icon: Brush },
    { name: "Electronics", icon: Laptop },
    { name: "Makeup", icon: Brush },
    { name: "Nails", icon: Pencil },
    { name: "Housing", icon: Home },
    { name: "Tutoring", icon: BookOpen },
    { name: "Automobile", icon: Car },
    { name: "Photography", icon: Camera },
    { name: "Tailoring", icon: PencilRuler },
    { name: "Cooking", icon: ChefHat },
    { name: "Massage", icon: Hand },
    { name: "Cleaning", icon: WashingMachine },
    { name: "Graphic Design", icon: Palette },
    { name: "Music", icon: Music },
  ]

  
  return (
    <div className="flex flex-col min-h-screen max-w-screen overscroll-x-none w-full">
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

      <div className='p-2 max-w-screen'>
        <ScrollArea className="w-full whitespace-nowrap mt-24 px-4 md:px-8 rounded-lg bg-muted/85 dark:bg-muted/30">
          <div className='flex items-center w-max gap-8 md:gap-12 p-4 '>
            <div className="flex flex-col items-center justify-center gap-2">
              <Link href={`/home/services`}>
              <div className="flex justify-center items-center rounded-full bg-transparent">
                <ArrowDownAZ className='h-8 w-8 md:h-12 md:w-12' />
              </div>
              </Link>
              <h2 className='text-xs md:text-sm font-semibold text-center'>All</h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Link href={`/home/services?favourites=true`}>
                <div className="flex justify-center items-center rounded-full bg-transparent">
                  <Heart className='h-8 w-8 md:h-12 md:w-12' />
                </div>
              </Link>
              <h2 className='text-xs md:text-sm font-semibold text-center'>Favourites</h2>
            </div>
            {categories.map((category) => (
              <Link key={category.name} href={`/home/services?category=${category.name.toLocaleLowerCase()}`}>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <category.icon className='h-8 w-8 md:h-12 md:w-12' />
                  <h2 className='text-xs md:text-sm font-semibold text-center'>{category.name}</h2>
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