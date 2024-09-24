"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon, LockClosedIcon, PersonIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()

  return (
    <Card className='m-2'>
        <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                <LockClosedIcon className="mr-3 h-8 w-8" />
                Error
            </CardTitle>
            <CardDescription className='max-w-sm px-2 text-center'>
                An Error occurred while trying to authenticate with our servers. Please try again.
            </CardDescription>
        </CardHeader>
        <CardFooter className='flex gap-3'>
          <Button onClick={()=>router.back()}>
            <ArrowLeftIcon className="mr-2"/>
            Go Back
          </Button>
          <Button onClick={()=>router.push("/auth/sign-in")}>
            <PersonIcon className='mr-2' />
            Sign In
          </Button>
        </CardFooter>
    </Card>
  )
}

export default page