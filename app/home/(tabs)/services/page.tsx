import React, { Suspense } from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from '@/app/home/(tabs)/services/_components/side-menu'
import { MatchedServices } from '@/app/home/(tabs)/services/_components/matched-services'
import { prisma } from '@/prisma/connection'
import { Skeleton } from '@/components/ui/skeleton'

const ServicesPage = async () => {
  const allServices = await prisma.service.findMany()
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">Services</h1>
        <div className="flex items-center space-x-3">
          <SearchBar />
          <SideMenu />
        </div>
      </div>

      {/* Content */}
      <div className="w-full mt-20">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        }>
          <MatchedServices allServices={allServices} />
        </Suspense>
      </div>
    </div>
  )
}

export default ServicesPage