"use client"

import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookCheck, Calendar, HomeIcon, SendIcon, CircleUserIcon } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { usePathname } from 'next/navigation'
import { useMode } from '@/contexts/mode-context'

export const ProviderNav = () => {
    const isMobile = useIsMobile()
    const { mode } = useMode()
    const user = useCurrentUser()
    const pathname = usePathname()

    if (isMobile || mode === "USER") return (
        <div className='flex justify-center items-center w-full'></div>
    )

    const tabs = [
        {name: "Appointments", link: `/home/services/provider/${user?.id}/appointments`, icon: <BookCheck className="w-4 h-4 mr-2" />},
        {name: "Calendar", link: `/home/services/provider/${user?.id}/calendar`, icon: <Calendar className="w-4 h-4 mr-2" />},
        {name: "Services", link: `/home/services/provider/${user?.id}/my-services`, icon: <HomeIcon className="w-4 h-4 mr-2" />},
        {name: "Messages", link: "/home/inbox", icon: <SendIcon className="w-4 h-4 mr-2" />},
        {name: "Settings", link: "/home/settings", icon: <CircleUserIcon className="w-4 h-4 mr-2" />}
    ]

  return (
    <div className='w-full flex justify-center pt-8 shadow-sm px-16'>
        <div className='flex justify-center items-center w-fit p-2 gap-8 bg-muted/20 rounded-md'>
            {tabs.map(tab=>(
                <Link href={tab.link} key={tab.name}>
                    <Button variant={pathname.includes(tab.link) ? "default" : "ghost"}>
                        {tab.icon}
                        <span>{tab.name}</span>
                    </Button>
                </Link>
            ))}
        </div>
    </div>
  )
}
