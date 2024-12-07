"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { SearchBar } from '../../_components/search-bar'
import { ServiceOptions } from './service-options'
import { BackButton } from '@/components/back-button'
import { Service } from '@prisma/client'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

interface ServiceHeaderProps {
    user: any;
    service: Service;
}

export const ServiceHeader = ({ user, service }: ServiceHeaderProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)')
    const router = useRouter()

    if (isMobile) {
        return (
            <div className="flex items-center justify-between h-16 w-full absolute top-5 z-10 py-2 px-6">
                <Button variant="outline" size="icon" onClick={()=>router.back()}>
                    <ChevronLeftIcon />
                </Button>
                <ServiceOptions service={service} />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
            <div className="flex justify-start items-center gap-3">
                <BackButton />
            </div>
            <div className="flex items-center space-x-3">
                <SearchBar />
                {user ? (
                    <Link href={`/home/services/cart`}>
                        <Button variant="outline" size="icon">
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Link href={`/auth/sign-up`}>
                        <Button>
                            Join
                        </Button>
                    </Link>
                )}
                <Link href={`/home/services/provider/${service.providerId}/chat`}>
                    <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </Link>
                <ServiceOptions service={service} />
            </div>
        </div>
    )
}
