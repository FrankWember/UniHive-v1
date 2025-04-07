"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CircleUserIcon, HeartIcon, SendIcon, HomeIcon, Calendar, BookCheck } from 'lucide-react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useMode } from '@/contexts/mode-context'

export const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const user = useCurrentUser()
    const { mode } = useMode()
    const tabs = mode === "PROVIDER" ? [
            {name: "Appointments", link: `/home/services/provider/${user?.id}/appointments`, icon: <BookCheck className="w-6 h-6" />},
            {name: "Calendar", link: `/home/services/provider/${user?.id}/calendar`, icon: <Calendar className="w-6 h-6" />},
            {name: "Services", link: `/home/services/provider/${user?.id}/my-services`, icon: <HomeIcon className="w-6 h-6" />},
            {name: "Messages", link: "/home/inbox", icon: <SendIcon className="w-6 h-6" />},
            {name: "Settings", link: "/home/settings", icon: <CircleUserIcon className="w-6 h-6" />}
        ] : [
            {name: "Explore", link: "/home/services", icon: <MagnifyingGlassIcon className="w-6 h-6" />},
            {name: "Favorites", link: "/home/services/favourites", icon: <HeartIcon className="w-6 h-6" />},
            {name: "Bookings", link: `/home/services/my-bookings`, icon: <HomeIcon className="w-6 h-6" />},
            {name: "Messages", link: "/home/inbox", icon: <SendIcon className="w-6 h-6" />},
            {name: "Settings", link: "/home/settings", icon: <CircleUserIcon className="w-6 h-6" />}
        ]
  return (
    <nav className="flex w-full justify-center md:hidden">
        <div className="fixed bottom-0 flex z-50 border-t w-full h-24 bg-background items-center justify-center px-4 py-2">
            {tabs.map(tab=>(
                <div
                    key={tab.name}
                    onClick={()=>router.push(tab.link)}
                    className={`w-full h-full flex flex-col gap-1 items-center justify-center text-xs ${pathname===tab.link ? "text-red-500" : "hover:text-red-800"}`}
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
