"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { PersonIcon } from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast'
import { SignOutAction } from '@/actions/logout'
import { useRouter } from 'next/navigation'

export const SignOutButton = () => {
    const { toast } = useToast()
    const router = useRouter()
    
    const onSignOut = async () => {
        await SignOutAction()
        .then(()=> {
            toast({
                title: "You Signed out",
                description: "Your account was signed out successfully."
            })
        })
        router.push("/home")
        router.refresh();
    }
  return (
    <Button onClick={onSignOut} variant="destructive">
        <PersonIcon className="mr-2" />
        Sign Out
    </Button>
  )
}
