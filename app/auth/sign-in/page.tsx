import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2Icon, LockClosedIcon } from '@radix-ui/react-icons'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SignInForm } from '../_components/sign-in-form'

const page = () => {
  return (
    <Card className='m-2'>
        <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                <LockClosedIcon className="mr-3 h-8 w-8" />
                Sign In
            </CardTitle>
            <CardDescription className='max-w-sm px-2 text-center'>
                Ready to empower your campus life? Let's get started.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense><SignInForm /></Suspense>
        </CardContent>
    </Card>
  )
}

export default page