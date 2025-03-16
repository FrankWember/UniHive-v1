"use client"
import React from 'react'
import { BackButton } from '@/components/back-button'
import { useIsMobile } from '@/hooks/use-mobile'
import { SideMenu } from '../../../_components/side-menu'
import Link from 'next/link'
import Image from 'next/image'

export const ProviderHeader = ({
    text,
    fixed=true,
    homeBtn=false
}:{
    text: string
    fixed?: boolean
    homeBtn?: boolean
}) => {
    const isMobile = useIsMobile()
  return (
    <div className={`flex items-center justify-between gap-3 h-16 w-screen border-b py-2 px-6 ${fixed?"fixed z-40 top-0 bg-background":"bg-background"}`}>
        <div className="flex justify-start items-center gap-3">
            {homeBtn ? (
                <Link href="/home/services">
                    <Image src="/DormBiz.png" alt="logo" width={50} height={50} className="rounded-md border" />
                </Link>
            ) : (
                <BackButton />
            )}
            <h1 className="text-2xl font-bold">{text}</h1>
        </div>
        {!isMobile && <SideMenu />}
    </div>
  )
}
