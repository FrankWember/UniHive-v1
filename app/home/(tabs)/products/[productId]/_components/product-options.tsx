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
import { ChatBubbleIcon, DotsVerticalIcon, Pencil1Icon, PersonIcon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Product, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteProduct } from '@/actions/products';

interface ProductOptionsProps {
    product: Product & { seller: User }
}

export const ProductOptions = ({ product }: ProductOptionsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter()
    const currentUser = useCurrentUser()

    const handleDelete = async () => {
        await deleteProduct(product.id)
        router.push('/home/products')
    }

    const handleEdit = () => {
        router.push(`/home/products/${product.id}/edit`)
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
                        {currentUser && currentUser?.id === product.sellerId ? (
                            <>
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Pencil1Icon className="mr-2" />Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <TrashIcon className="mr-2" />Delete
                                        </DropdownMenuItem>
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
                                <DropdownMenuItem onClick={() => router.push(`/home/products/seller/${product.sellerId}`)}>
                                    <PersonIcon className="mr-2" />View Seller
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/home/products/seller/${product.sellerId}/chat`)}>
                                    <ChatBubbleIcon className="mr-2" />Chat
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center space-x-4">
                    {currentUser && currentUser?.id === product.sellerId ? (
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
                                            This action cannot be undone. This will permanently delete your product.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <Link href={`/home/products/seller/${product.sellerId}`}>
                                <Button variant="outline" size="icon">
                                    <PersonIcon />
                                </Button>
                            </Link>
                            <Link href={`/home/products/seller/${product.sellerId}/chat`}>
                                <Button variant="outline" size="icon">
                                    <ChatBubbleIcon />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ProductOptions;
