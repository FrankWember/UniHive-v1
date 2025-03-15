"use client"
import React from 'react'
import { BackButton } from '@/components/back-button'
import { useIsMobile } from '@/hooks/use-mobile'
import { SideMenu } from '../../../_components/side-menu'

export const ProviderHeader = ({
    text,
    fixed=true
}:{
    text: string
    fixed?: boolean
}) => {
    const isMobile = useIsMobile()
  return (
    <div className={`flex items-center justify-between gap-3 h-16 w-screen border-b py-2 px-6 ${fixed?"fixed z-40 top-0 bg-background":"bg-background"}`}>
        <div className="flex justify-start gap-3">
            <BackButton />
            <h1 className="text-2xl font-bold">{text}</h1>
        </div>
        {!isMobile && <SideMenu />}
    </div>
  )
}
