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
import { Product } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteProduct } from '@/actions/products';
import { 
    Pencil,
    Trash2,
    User,
    PanelRight
} from 'lucide-react';
import { ArchiveIcon } from '@radix-ui/react-icons';

interface ProductOptionsProps {
    product: Product;
}

export const ProductOptions = ({ product }: ProductOptionsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter()
    const currentUser = useCurrentUser()
    const isOwner = currentUser?.id === product.sellerId;

    const handleDelete = async () => {
        await deleteProduct(product.id)
        router.push('/home/products')
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
                    <SheetTitle className="text-2xl font-bold">product Options</SheetTitle>
                    <SheetDescription>
                        {isOwner ? 'Manage your product settings' : 'Interact with this product'}
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
                                            onClick={() => router.push(`/home/products/my-orders`)}
                                        >
                                            <ArchiveIcon className="mr-2 h-4 w-4" />
                                            Orders
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => router.push(`/home/products/${product.id}/edit`)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Product
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete product
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your product.
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
                                            onClick={() => router.push(`/home/products/sellers/${product.sellerId}`)}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            View Seller
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