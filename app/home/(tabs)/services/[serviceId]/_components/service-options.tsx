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
import { DotsVerticalIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import {ServiceActions} from './service-actions';
import { Service } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteService } from '@/actions/services';

const ServiceOptions = ({ service }: {service: Service}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter()
  const currentUser = useCurrentUser()

  const handleDelete = async () => {
    await deleteService(service.id)
    router.push('/home/services')
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
            <DropdownMenuItem onClick={()=>router.push(`/home/services/provider/${service.providerId}`)}>View Provider</DropdownMenuItem>
            {currentUser?.id === service.providerId && (
                <>
                <DropdownMenuItem onClick={()=>router.push(`/home/services/${service.id}/edit`)}>Edit</DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center space-x-4">
          <Link href={`/home/services/provider/${service.providerId}`}>
            <Button variant="outline">
              <PersonIcon className="mr-2 h-4 w-4" />
              View Provider
            </Button>
          </Link>
          <ServiceActions serviceId={service.id} providerId={service.providerId} />
        </div>
      )}
    </>
  );
};

export default ServiceOptions;
