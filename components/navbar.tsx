"use client"

import React from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarSearch, CarTaxiFrontIcon, CogIcon, GraduationCap, StoreIcon } from 'lucide-react'


export const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const tabs = [
        {name: "Services", link: "/home/services", children: <StoreIcon className="w-6 h-6" />},
        {name: "Rides", link: "/home/rides", children: <CarTaxiFrontIcon className="w-6 h-6"  />},
        {name: "Courses", link: "/home/courses", children: <GraduationCap className="w-6 h-6" />},
        {name: "Events", link: "/home/events", children: <CalendarSearch className="w-6 h-6" />},
        {name: "Settings", link: "/home/settings", children: <CogIcon className="w-6 h-6" />},
    ]
  return (
    <nav className="flex w-full justify-center ">
        <div className="fixed bottom-5 flex z-50 border rounded-full mx-3 w-fit h-14 bg-muted/20 items-center justify-center backdrop-blur-sm">
            {tabs.map(tab=>(
                <Button
                    variant={pathname.includes(tab.link)?"default":"ghost"}
                    key={tab.name}
                    onClick={()=>router.push(tab.link)}
                    className="rounded-full w-full h-full"
                >
                    {tab.children}
                </Button>
            ))}
        </div>
        <div className="flex w-full h-14"></div>
    </nav>
  )
}
