"use client"

import React, { Suspense } from 'react'
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
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Event } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { addAttendee, removeAttendee, isUserAttending, deleteEvent } from '@/actions/events'
import { Skeleton } from '@/components/ui/skeleton';

const EventOptions = ({ event }: {event: Event}) => {
    const [isAttending, setIsAttending] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter()
    const currentUser = useCurrentUser()

    React.useEffect(() => {
        if (currentUser) {
          isUserAttending(event.id, currentUser.id!).then(setIsAttending)
        }
      }, [event.id, currentUser])
    
    const handleAttendeeAction = async () => {
        if (!currentUser) {
            router.push('/auth/sign-in')
            return
        }

        setIsLoading(true)
        try {
            if (isAttending) {
            await removeAttendee(event.id, currentUser.id!)
            } else {
            await addAttendee(event.id, currentUser.id!)
            }
            setIsAttending(!isAttending)
            router.refresh()
        } catch (error) {
            console.error('Error updating attendee status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        await deleteEvent(event.id, currentUser?.id!)
        router.push('/home/events')
        router.refresh()
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
                <DropdownMenuItem onClick={handleAttendeeAction}>{isAttending ? 'Cancel Attendance' : 'Attend Event'}</DropdownMenuItem>
                {currentUser?.id === event.creatorId && (
                    <>
                    <DropdownMenuItem onClick={()=>router.push(`/home/events/${event.id}/edit`)}>Edit</DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your event.
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
                <Suspense fallback={<Skeleton className="w-24 h-10" />}>
                    <Button onClick={handleAttendeeAction} disabled={isLoading}>
                        {isAttending ? 'Cancel Attendance' : 'Attend Event'}
                    </Button>
                </Suspense>
                {currentUser?.id===event.creatorId && (
                    <>
                        <Link href={`/home/events/${event.id}/edit`} passHref>
                            <Button variant="outline" size="sm">
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit Event
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your event.
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
            </div>
        )}
        </>
    );
};

export default EventOptions;
