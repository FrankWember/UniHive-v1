"use client"

import { HomeIcon, PersonIcon, CalendarIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { CarIcon, CogIcon } from 'lucide-react'


export const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const tabs = [
        {name: "Services", link: "/home/services", children: <HomeIcon className="w-6 h-6" />},
        {name: "Rides", link: "/home/rides", children: <CarIcon className="w-6 h-6"  />},
        {name: "StudyGroups", link: "/home/study-grups", children: <PersonIcon className="w-6 h-6" />},
        {name: "Events", link: "/home/events", children: <CalendarIcon className="w-6 h-6" />},
        {name: "Settings", link: "/home/settings", children: <CogIcon className="w-6 h-6" />},
    ]
  return (
    <nav className="fixed flex w-full justify-center bottom-5">
        <div className="flex z-50 border rounded-full mx-3 w-fit h-14 bg-muted/20 items-center justify-center">
            {tabs.map(tab=>(
                <Button
                    variant={tab.link.includes(pathname)?"default":"ghost"}
                    key={tab.name}
                    onClick={()=>router.push(tab.link)}
                    className="rounded-full w-full h-full"
                >
                    {tab.children}
                </Button>
            ))}
        </div>
    </nav>
  )
}
