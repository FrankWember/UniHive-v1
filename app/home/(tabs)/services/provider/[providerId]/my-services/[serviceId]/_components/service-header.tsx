"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { SearchBar } from '@/app/home/(tabs)/services/_components/search-bar'
import { ServiceOptions } from './service-options'
import { BackButton } from '@/components/back-button'
import { Service } from '@prisma/client'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMode } from '@/contexts/mode-context'
import { SideMenu } from '@/app/home/(tabs)/services/_components/side-menu'

interface ServiceHeaderProps {
    user: any;
    service: Service;
}

export const ServiceHeader = ({ user, service }: ServiceHeaderProps) => {
    const isMobile = useIsMobile()
    const {mode} = useMode()
    const router = useRouter()

    if (mode === "PROVIDER" && isMobile) {
        return (
            <div className="flex items-center justify-between h-16 w-full absolute top-5 z-10 py-2 px-6">
                <Button variant="outline" size="icon" onClick={()=>router.back()}>
                    <ChevronLeftIcon />
                </Button>
                <ServiceOptions service={service} />
            </div>
        )
    } else if (mode === "PROVIDER") {
        return (
            <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6">
                <div className="flex justify-start items-center gap-3">
                    <BackButton />
                </div>
                <div className="flex items-center space-x-3">
                    <ServiceOptions service={service} />
                    <SideMenu />
                </div>
            </div>
        )
    } else if (isMobile) {
        return null
    } else return (
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6">
            <div className="flex justify-start items-center gap-3">
                <BackButton />
                <h2 className="text-xl font-semibold">{service.name}</h2>   
            </div>
            <div className="flex items-center space-x-3">
                <SearchBar />
                <SideMenu />
            </div>
        </div>
    )
}
