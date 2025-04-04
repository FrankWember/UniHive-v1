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
import { Scissors, Brush, Laptop, Home, BookOpen, Car, Camera, PencilRuler, ChefHat, WashingMachine, Palette, Music, Rotate3d} from 'lucide-react';
import { ServicesHeader } from './_components/services-header'

const ServicesPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const user = await currentUser()

  const categories = [
    { name: "Barber", icon: Scissors, link: "/icons/Barber.png" },
    { name: "Braiding", icon: Brush, link: "/icons/icons8-braid-48.png" },
    { name: "Electronics", icon: Laptop, link: "/Electronics.png" },
    { name: "Makeup", icon: Brush, link: "/icons/Beauty.png" },
    { name: "Nails", icon: Pencil, link: "/icons/icons8-nails-50.png" },
    { name: "Housing", icon: Home, link: "/icons/icons8-house-50.png" },
    { name: "Tutoring", icon: BookOpen, link: "/icons/icons8-tutor-48.png" },
    { name: "3D Printing", icon: Rotate3d, link: "/icons/3d-printing.png" },
    { name: "Automobile", icon: Car, link: "/icons/icons8-car-50.png" },
    { name: "Photography", icon: Camera, link: "/icons/icons8-camera-50.png" },
    { name: "Tailoring", icon: PencilRuler, link: "/icons/icons8-dress-50.png" },
    { name: "Cooking", icon: ChefHat, link: "/icons/icons8-cooking-50.png" },
    { name: "Cleaning", icon: WashingMachine, link: "/icons/icons8-cleaning-50.png" },
    { name: "Graphic Design", icon: Palette, link: "/icons/icons8-design-50.png" },
    { name: "Music", icon: Music, link: "/icons/icons8-music-50.png" },
  ]

  
  return (
    <div className="flex flex-col min-h-screen max-w-screen overscroll-x-none w-full bg-background/100">
      {/* Header  */}
      <ServicesHeader />

      <div className='p-2 max-w-screen'>
        <ScrollArea className="w-full whitespace-nowrap mt-[5.5rem] px-4 md:px-4 bg-muted/5 shadow-sm scroll-smooth bg-background/100">
          <div className='flex items-center w-max gap-8 md:gap-12 p-2 h-14'>
            <Link  href={`/home/services`}>
              <div className='group flex flex-col items-center justify-center gap-2'>
                <Image src="/icons/icons8-list-64.png" alt={"all"} width={16} height={16} className='object-cover'/>
                <h2 className='text-xs md:text-sm font-semibold text-center text-muted-foreground'>All</h2>
                <div className='w-full h-0.5 rounded-lg bg-background group-hover:bg-gray-800'></div>
              </div>
            </Link>
            {categories.map((category) => (
              <Link key={category.name} href={`/home/services?category=${category.name.toLocaleLowerCase()}`}>
                <div className='group flex flex-col items-center justify-center gap-2'>
                  <Image src={category.link} alt={category.name} width={16} height={16} className='object-cover'/>
                  <h2 className='text-xs md:text-sm font-semibold text-center text-muted-foreground'>{category.name}</h2>
                  <div className='w-full h-0.5 rounded-lg bg-background group-hover:bg-gray-800'></div>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className='hidden' />
        </ScrollArea>
      </div>

      {/* Content */}
      <div className="w-full pb-8">
        <MatchedServices searchParams={searchParams} />
      </div>
    </div>
  )
}

export default ServicesPage
