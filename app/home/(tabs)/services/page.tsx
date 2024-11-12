import React from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from './_components/side-menu'
import { MatchedServices } from './_components/matched-services'
import { ServicesProvider } from '@/contexts/services-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

const ServicesPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <ServicesProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header  */}
        <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <h1 className="text-2xl font-bold">Services</h1>
          <div className="flex items-center space-x-3">
            <SearchBar />
            <Link href={`/home/services/cart`}>
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <SideMenu />
          </div>
        </div>

        {/* Content */}
        <div className="w-full mt-20 pb-24">
          <MatchedServices searchParams={searchParams} />
        </div>
      </div>
    </ServicesProvider>
  )
}

export default ServicesPage