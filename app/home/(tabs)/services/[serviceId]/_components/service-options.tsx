"use client"

import { useMediaQuery } from '@/hooks/use-media-query';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Service } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteService } from '@/actions/services';
import { 
    BookOpen,
    MessageCircle,
    Pencil,
    Settings,
    Trash2,
    User,
    PanelRight
} from 'lucide-react';
import { CardStackPlusIcon, ReaderIcon } from '@radix-ui/react-icons';

interface ServiceOptionsProps {
    service: Service;
}

export const ServiceOptions = ({ service }: ServiceOptionsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter()
    const currentUser = useCurrentUser()
    const isOwner = currentUser?.id === service.providerId;

    const handleDelete = async () => {
        await deleteService(service.id)
        router.push('/home/services')
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                    <PanelRight className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Service Options</SheetTitle>
                    <SheetDescription>
                        {isOwner ? 'Manage your service settings' : 'Interact with this service'}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[80vh]">
                    <div className="space-y-4 py-4">
                        <div className="px-3 py-2">
                            <div className="space-y-1">
                                {isOwner ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/services/${service.id}/bookings`)}
                                        >
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Bookings
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/services/${service.id}/edit`)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Service
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/services/${service.id}/offers/add`)}
                                        >
                                            <CardStackPlusIcon className="mr-2 h-4 w-4" />
                                            Add Offers
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/services/${service.id}/offers`)}
                                        >
                                            <ReaderIcon className="mr-2 h-4 w-4" />
                                            Manage Offers
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Service
                                                </Button>
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
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/services/provider/${service.providerId}`)}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            View Provider
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/services/provider/${service.providerId}/chat`)}
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Chat with Provider
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}