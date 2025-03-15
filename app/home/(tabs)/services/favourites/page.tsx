import { BackButton } from '@/components/back-button'
import React from 'react'
import { MatchedServices } from '../_components/matched-services'
import { SideMenu } from '../_components/side-menu'

const page = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-screen overscroll-x-none w-full">
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6">
          <div className='flex items-center justify-start gap-3'>
            <BackButton />
            <h1 className="text-2xl font-bold">Favourites</h1>
          </div>
          <SideMenu />
        </div>

        {/* Content */}
        <div className="w-full pb-24">
            <MatchedServices searchParams={{ favourites: 'true' }} />
        </div>
    </div>
  )
}

export default page