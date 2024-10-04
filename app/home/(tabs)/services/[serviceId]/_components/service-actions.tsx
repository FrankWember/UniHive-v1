"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useCurrentUser } from '@/hooks/use-current-user'
import { deleteService } from '@/actions/services'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ServiceActionsProps {
  serviceId: string
  providerId: string
}

export const ServiceActions: React.FC<ServiceActionsProps> = ({ serviceId, providerId }) => {
  const router = useRouter()
  const currentUser = useCurrentUser()

  if (currentUser?.id !== providerId) {
    return null
  }

  const handleEdit = () => {
    router.push(`/home/services/${serviceId}/edit`)
  }

  const handleDelete = async () => {
    await deleteService(serviceId)
    router.push('/home/services')
  }

  return (
    <div className="flex space-x-2">
      <Button onClick={handleEdit}>Edit</Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}