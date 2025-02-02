"use client"

import React from 'react'
import { Card, CardTitle, CardDescription, CardFooter, CardHeader } from './ui/card'
import Link from 'next/link'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export const ComingSoon = () => {
    const router = useRouter()
  return (
    <div className="w-full h-full flex items-center justify-center">
        <Card className='p-3'>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This feature is currently under development.</CardDescription>
            </CardHeader>
            <CardFooter className='flex gap-3 justify-end'>
                <Button variant='outline' onClick={() => router.back()}>
                    Go Back
                </Button>
                <Link href="/home">
                    <Button>
                        Home Page 
                    </Button>
                </Link>
            </CardFooter>
        </Card>
        
    </div>
  )
}
