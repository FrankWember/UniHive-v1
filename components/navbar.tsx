"use client"

import React from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { CircleUserIcon, HeartIcon, SendIcon, HomeIcon } from 'lucide-react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useCurrentUser } from '@/hooks/use-current-user'


export const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const user = useCurrentUser()
    const bookingsUrl = user?.role === "SELLER" || user?.role === "ADMIN" ? `/home/services/provider/${user?.id}/bookings` : `/home/services/my-bookings`
    const tabs = [
        {name: "Explore", link: "/home/services", icon: <MagnifyingGlassIcon className="w-6 h-6" />},
        {name: "Favorites", link: "/home/services?favourites=true", icon: <HeartIcon className="w-6 h-6" />},
        {name: "Bookings", link: bookingsUrl, icon: <HomeIcon className="w-6 h-6" />},
        {name: "Messages", link: "/home/inbox", icon: <SendIcon className="w-6 h-6" />},
        {name: "Settings", link: "/home/settings", icon: <CircleUserIcon className="w-6 h-6" />}
    ]
  return (
    <nav className="flex w-full justify-center md:hidden">
        <div className="fixed bottom-0 flex z-50 border-t w-full h-20 bg-muted/20 items-center justify-center backdrop-blur-sm px-4 py-2">
            {tabs.map(tab=>(
                <div
                    key={tab.name}
                    onClick={()=>router.push(tab.link)}
                    className={`w-full h-full flex flex-col gap-1 items-center justify-center text-xs ${pathname.includes(tab.link) ? "text-red-500" : "hover:text-red-800"}`}
                >
                    {tab.icon}
                    {tab.name}
                </div>
            ))}
        </div>
        <div className="flex w-full h-14"></div>
    </nav>
  )
}
