"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import React from 'react'

export const GoBackButton = () => {
    const router = useRouter()
  return (
    <Button variant="outline" onClick={()=>router.back()} className="flex gap-2"><ArrowLeftIcon /> Go Back</Button>
  )
}
