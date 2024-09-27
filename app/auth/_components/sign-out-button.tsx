"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { PersonIcon } from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast'
import { SignOutAction } from '@/actions/logout'

export const SignOutButton = () => {
    const { toast } = useToast()
    
    const onSignOut = async () => {
        await SignOutAction()
        .then(()=> {
            toast({
                title: "You Signed out",
                description: "Your account was signed out successfully."
            })
        })
    }
  return (
    <Button onClick={onSignOut} variant="destructive">
        <PersonIcon className="mr-2" />
        Sign Out
    </Button>
  )
}
