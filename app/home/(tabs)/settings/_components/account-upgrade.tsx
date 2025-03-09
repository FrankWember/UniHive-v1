"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { BeatLoader } from 'react-spinners'
import { sendEmail } from '@/lib/mail'
import { useToast } from '@/hooks/use-toast'
import { APP_URL } from "@/constants/paths"

export const AccountUpgrade = () => {
    const user = useCurrentUser()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    function handleRequestUpgrade() {
        setIsSubmitting(true)
        sendEmail({
            to: 'unihive2025@gmail.com',
            subject: 'Unihive Account Upgrade',
            text: `The User with email ${user?.email} has requested an upgrade to premium account.`,
            html: `
                <h1>The Following User has requested an upgrade to premium account:</h1>
                <p>Name: ${user?.name}</p>
                <p>Email: ${user?.email}</p>
                <p>Head out to the <a href="${APP_URL}/admin">Admin Page</a> to upgrade this account.</p>
            `
        })
        toast({
            title: 'Request Sent',
            description: 'We have sent an email to the admin to upgrade your account.',
        })
        setIsSubmitting(false)
    }

    if (user?.role === "ADMIN" || user?.role === "SELLER") return null

  return (
    <Card className="w-full max-w-md mx-3">
        <CardHeader>
            <CardTitle>Account Upgrade</CardTitle>
            <CardDescription>Upgrade your account to access premium features.</CardDescription>
        </CardHeader>
        <CardFooter className='flex justify-end'>
            <Button onClick={handleRequestUpgrade} disabled={isSubmitting}>
                {isSubmitting ? <BeatLoader /> : 'Request Upgrade'}
            </Button>
        </CardFooter>
    </Card>
  )
}
