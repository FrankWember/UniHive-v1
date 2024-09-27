import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LockClosedIcon } from '@radix-ui/react-icons'
import React, { Suspense } from 'react'
import { PasswordResetForm } from '@/app/auth/_components/password-reset-form'

const page = () => {
  return (
    <Card className='m-2'>
        <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                <LockClosedIcon className="mr-3 h-8 w-8" />
                Password Reset
            </CardTitle>
            <CardDescription className='max-w-sm px-2 text-center'>
                Are you sure you want to reset your password ?
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense><PasswordResetForm /></Suspense>
        </CardContent>
    </Card>
  )
}

export default page