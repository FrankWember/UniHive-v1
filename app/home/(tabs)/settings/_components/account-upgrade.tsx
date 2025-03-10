"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { BeatLoader } from 'react-spinners'
import { sendEmail } from '@/lib/mail'
import { useToast } from '@/hooks/use-toast'
import { APP_URL } from "@/constants/paths"
import { sendAccountUpgradeEmail } from '@/actions/user'

export const AccountUpgrade = () => {
    const user = useCurrentUser()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    async function handleRequestUpgrade() {
        setIsSubmitting(true)
        await sendAccountUpgradeEmail()
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
