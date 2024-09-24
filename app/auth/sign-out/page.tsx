import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2Icon, LockClosedIcon } from '@radix-ui/react-icons'
import React, { Suspense } from 'react'
import { SignOutButton } from '@/app/auth/_components/sign-out-button'
import { CancelButton } from '@/app/auth/_components/cancel-button'

const page = () => {
  return (
    <Card className='m-2'>
        <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                <LockClosedIcon className="mr-3 h-8 w-8" />
                Sign Out
            </CardTitle>
            <CardDescription className='max-w-sm px-2 text-center'>
                Are you sure you want to sign out ?
            </CardDescription>
        </CardHeader>
        <CardFooter className='flex gap-3'>
          <CancelButton />
          <SignOutButton />
        </CardFooter>
    </Card>
  )
}

export default page