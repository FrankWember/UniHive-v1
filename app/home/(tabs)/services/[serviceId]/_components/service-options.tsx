"use client"

import { useMediaQuery } from '@/hooks/use-media-query';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { Button } from '@/components/ui/button';
import { ChatBubbleIcon, DotsVerticalIcon, Pencil1Icon, Pencil2Icon, PersonIcon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Service } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteService } from '@/actions/services';
import { NotebookIcon } from 'lucide-react';

const ServiceOptions = ({ service }: {service: Service}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter()
  const currentUser = useCurrentUser()

  const handleDelete = async () => {
    await deleteService(service.id)
    router.push('/home/services')
  }

  const handleEdit = () => {
    router.push(`/home/services/${service.id}/edit`)
  }

  const handleBookings = () => {
    router.push(`/home/services/${service.id}/bookings`)
  }

  return (
    <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
                <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {currentUser && currentUser?.id === service.providerId ? (
                <>
                <DropdownMenuItem onClick={()=>router.push(`/home/services/${service.id}/bookings`)}><NotebookIcon className="mr-2" />Bookings</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push(`/home/services/${service.id}/edit`)}><Pencil1Icon className="mr-2" />Edit</DropdownMenuItem>           
                <AlertDialog>
                    <AlertDialogTrigger>
                        <DropdownMenuItem><TrashIcon className="mr-2" />Delete</DropdownMenuItem>
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
                </>
            ):(
              <>
              <DropdownMenuItem onClick={()=>router.push(`/home/services/provider/${service.providerId}`)}><PersonIcon className="mr-2" />View Provider</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>router.push(`/home/services/${service.id}/review`)}><Pencil2Icon className="mr-2" />Review</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>router.push(`/home/services/provider/${service.providerId}/chat`)}><ChatBubbleIcon className="mr-2" />Chat</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
    </>
  );
};

export default ServiceOptions;
