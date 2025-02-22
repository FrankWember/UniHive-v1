import { BackButton } from '@/components/back-button'
import { Card } from '@/components/ui/card'
import React from 'react'
import { RegistrationForm } from './_components/register-form'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

const DriverRegistrationPage = async () => {
    const user = await currentUser()

    if (!user || !user.id) redirect(`auth/sign-in?callbackUrl=${encodeURIComponent("/home/rides/driver/register")}`)

    return (
        <div className='flex flex-col min-h-screen w-screen'>
            <div className='flex gap-4 p-4 h-16 items-center fixed top-0 w-full border-b bg-background/80 backdrop-blur-sm'>
                <BackButton />
                <h1 className='text-2xl font-bold'>Register as Driver</h1>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full my-24 pb-24 px-3'>
                <RegistrationForm userId={user?.id!} />
            </div>
        </div>
    )
}

export default DriverRegistrationPage