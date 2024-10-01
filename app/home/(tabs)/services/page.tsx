import React, { Suspense } from 'react'
import { SearchBar } from './_components/search-bar'
import { SideMenu } from '@/app/home/(tabs)/services/_components/side-menu'
import { MatchedServices } from '@/app/home/(tabs)/services/_components/matched-services'

const ServicesPage = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <h1 className="text-2xl font-bold">Services</h1>
        <div className="flex items-center space-x-3">
          <SearchBar />
          <SideMenu />
        </div>
      </div>

      <div className="w-full mt-20">
        <Suspense><MatchedServices /></Suspense>
      </div>
    </div>
  )
}

export default ServicesPage