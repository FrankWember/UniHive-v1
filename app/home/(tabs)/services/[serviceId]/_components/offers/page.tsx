import React from 'react'
import { BackButton } from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { SearchBar } from '../../../_components/search-bar'
import Image from 'next/image'
import Link from 'next/link'
import { currentUser } from '@/lib/auth'

const OffersPage = async ({params}: {params: {serviceId: string}}) => {
    const user = await currentUser()
  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
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
          </div>
        </div>
    </div>
  )
}

export default OffersPage