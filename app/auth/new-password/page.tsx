import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LockClosedIcon } from '@radix-ui/react-icons'
import React, { Suspense } from 'react'
import { NewPasswordForm } from '@/app/auth/_components/new-password-form'

const page = () => {
  return (
    <Card className='m-2'>
        <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                <LockClosedIcon className="mr-3 h-8 w-8" />
                New Password
            </CardTitle>
            <CardDescription className='max-w-sm px-2 text-center'>
                There we go. Now you can give a new paassword to your account.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense><NewPasswordForm /></Suspense>
        </CardContent>
    </Card>
  )
}

export default page