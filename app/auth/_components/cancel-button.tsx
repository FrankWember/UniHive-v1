"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import React from 'react'

export const CancelButton = () => {
    const router = useRouter()
  return (
    <Button onClick={()=>router.back()} variant="outline">
        <ArrowLeftIcon className="mr-2" />
        Cancel
    </Button>
  )
}
