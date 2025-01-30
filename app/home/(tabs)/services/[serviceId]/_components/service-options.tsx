"use client"

import { useRouter } from 'next/navigation'
import { Service } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { deleteService } from '@/actions/services'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { BookOpen, MessageCircle, Pencil, Trash2, User, PanelRight, BriefcaseBusiness } from 'lucide-react'
import { CardStackPlusIcon, ReaderIcon } from '@radix-ui/react-icons'

interface ServiceOptionsProps {
  service: Service
}

export const ServiceOptions = ({ service }: ServiceOptionsProps) => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const isOwner = currentUser?.id === service.providerId

  const handleDelete = async () => {
    await deleteService(service.id)
    router.push('/home/services')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Service Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isOwner ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push(`/home/services/${service.id}/bookings`)}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Bookings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/services/${service.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Service</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/services/${service.id}/offers/add`)}>
              <CardStackPlusIcon className="mr-2 h-4 w-4" />
              <span>Add Offers</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/services/${service.id}/offers`)}>
              <ReaderIcon className="mr-2 h-4 w-4" />
              <span>Manage Offers</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/services/${service.id}/portfolio`)}>
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              <span>Manage Portfolio</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span className="text-destructive">Delete Service</span>
                </DropdownMenuItem>
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
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuItem onClick={() => router.push(`/home/services/provider/${service.providerId}`)}>
            <User className="mr-2 h-4 w-4" />
            <span>View Provider</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}