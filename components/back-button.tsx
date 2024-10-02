"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@radix-ui/react-icons'

export const BackButton = () => {
    const router = useRouter()
  return (
    <Button onClick={() => router.back()} variant="outline" size="icon">
        <ChevronLeftIcon />
    </Button>
  )
}
