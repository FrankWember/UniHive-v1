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
import { Money01Icon } from 'hugeicons-react';

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
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
                <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {currentUser && currentUser?.id === service.providerId ? (
                <>
                <DropdownMenuItem onClick={()=>router.push(`/home/services/${service.id}/bookings`)}><Money01Icon className="mr-2" />Bookings</DropdownMenuItem>
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
      ) : (
        <div className="flex items-center space-x-4">
          {currentUser && service.providerId===currentUser!.id ? (
            <div className="flex space-x-2">
              <Button onClick={handleBookings}>Bookings</Button>
              <Button onClick={handleEdit}>Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon"><TrashIcon/></Button>
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
          ):(
            <div className="flex space-x-2">
              <Link href={`/home/services/provider/${service.providerId}`}>
                <Button variant="outline" size="icon">
                  <PersonIcon />
                </Button>
              </Link>
              <Link href={`/home/services/provider/${service.providerId}/chat`}>
                <Button variant="outline" size="icon">
                  <ChatBubbleIcon />
                </Button>
              </Link>
              <Link href={`/home/services/provider/${service.providerId}/review`}>
                <Button variant="outline" size="icon">
                  <Pencil2Icon />
                </Button>
              </Link>
            </div>
          )}         
        </div>
      )}
    </>
  );
};

export default ServiceOptions;
