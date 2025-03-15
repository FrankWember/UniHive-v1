import React from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedServices } from './_components/matched-services'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowDownAZ, Heart, Pencil } from 'lucide-react'
import { currentUser } from '@/lib/auth'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Scissors, Brush, Laptop, Home, BookOpen, Car, Camera, PencilRuler, ChefHat, Hand, WashingMachine, Palette, Music } from 'lucide-react';
import { ServicesHeader } from './_components/services-header'

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
      <ServicesHeader />

      <div className='p-2 max-w-screen'>
        <ScrollArea className="w-full whitespace-nowrap mt-24 px-4 md:px-8 bg-muted/5 shadow-sm">
          <div className='flex items-center w-max gap-8 md:gap-12 p-4 h-16 md:h-20'>
            <div className="group flex flex-col items-center justify-center gap-2">
              <Link href={`/home/services`}>
                <div className="flex justify-center items-center rounded-full bg-transparent">
                  <ArrowDownAZ className='h-4 w-4 md:h-8 md:w-8 text-muted-foreground fill-muted-foreground' />
                </div>
              </Link>
              <h2 className='text-xs md:text-sm font-semibold text-center text-muted-foreground'>All</h2>
              <div className='w-full h-1 rounded-lg bg-background group-hover:bg-foreground'></div>
            </div>
            <div className="group flex flex-col items-center justify-center gap-2">
              <Link href={`/home/services/favourites`}>
                <div className="flex justify-center items-center rounded-full bg-transparent">
                  <Heart className='h-4 w-4 md:h-8 md:w-8 text-muted-foreground fill-muted-foreground' />
                </div>
              </Link>
              <h2 className='text-xs md:text-sm font-semibold text-center text-muted-foreground'>Favourites</h2>
              <div className='w-full h-1 rounded-lg bg-background group-hover:bg-foreground'></div>
            </div>
            {categories.map((category) => (
              <Link key={category.name} href={`/home/services?category=${category.name.toLocaleLowerCase()}`}>
                <div className='group flex flex-col items-center justify-center gap-2'>
                  <category.icon className='h-4 w-4 md:h-8 md:w-8 text-muted-foreground fill-muted-foreground' />
                  <h2 className='text-xs md:text-sm font-semibold text-center text-muted-foreground'>{category.name}</h2>
                  <div className='w-full h-1 rounded-lg bg-background group-hover:bg-foreground'></div>
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
  )
}

export default ServicesPage