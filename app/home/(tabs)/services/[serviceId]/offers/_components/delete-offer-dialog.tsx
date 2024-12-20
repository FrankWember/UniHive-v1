"use client"

import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { deleteServiceOffer } from '@/actions/service-offers'
import { Button } from '@/components/ui/button'
import { ServiceOffer } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { BeatLoader } from 'react-spinners';

export const DeleteOfferDialog = ({offer}: {offer: ServiceOffer}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const router = useRouter()

    const deleteOffer = async () => {
        setError("")
        setSuccess("")
        setIsSubmitting(true)
        try {
            await deleteServiceOffer(offer.id)
            setSuccess("Your offer has been deleted")
            router.push(`/home/services/${offer.serviceId}/offers`)
        } catch (error) {
            setError("We couldn't delete your offer. Please try again!")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
      <Dialog>
        <DialogTrigger>
          <Button>Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Offer</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete this offer?
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <RocketIcon className="h-6 w-6"/>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className='flex justify-end'>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button onClick={deleteOffer} disabled={isSubmitting}>
              {isSubmitting ? <BeatLoader /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }