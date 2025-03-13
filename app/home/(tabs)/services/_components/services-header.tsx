"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchBar } from './search-bar'
import { SideMenu } from './side-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'

export const ServicesHeader = () => {
  const user = useCurrentUser()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <SearchBar />
        <SideMenu />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start items-center gap-3">
            <Link href="/home/services">
              <Image src="/DormBiz.png" alt="logo" width={50} height={50} className="rounded-md border" />
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
  )
}
