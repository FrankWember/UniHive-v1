"use client"
import React from 'react'
import { BackButton } from '@/components/back-button'
import { useIsMobile } from '@/hooks/use-mobile'
import { SideMenu } from '../../../_components/side-menu'

export const ProviderHeader = ({
    text
}:{
    text: string
}) => {
    const isMobile = useIsMobile()
  return (
    <div className="flex items-center justify-between gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start gap-3">
            <BackButton />
            <h1 className="text-2xl font-bold">{text}</h1>
        </div>
        {!isMobile && <SideMenu />}
    </div>
  )
}
