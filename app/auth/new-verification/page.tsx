import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LockClosedIcon } from '@radix-ui/react-icons'
import React, { Suspense } from 'react'
import { NewVerificationForm } from '@/app/auth/_components/new-verification-form'

const page = () => {
  return (
    <Card className='m-2'>
        <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl font-bold" >
                <LockClosedIcon className="mr-3 h-8 w-8" />
                New Verification
            </CardTitle>
            <CardDescription className='max-w-sm px-2 text-center'>
                Open your mailbox. We sent you a mail to verify your account.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense><NewVerificationForm /></Suspense>
        </CardContent>
    </Card>
  )
}

export default page