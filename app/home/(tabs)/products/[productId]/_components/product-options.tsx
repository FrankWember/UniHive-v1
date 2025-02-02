"use client"

import { useRouter } from 'next/navigation'
import { Product } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { deleteProduct } from '@/actions/products'
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
import { Pencil, Trash2, User, PanelRight } from 'lucide-react'
import { ArchiveIcon } from '@radix-ui/react-icons'

interface ProductOptionsProps {
  product: Product
}

export const ProductOptions = ({ product }: ProductOptionsProps) => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const isOwner = currentUser?.id === product.sellerId

  const handleDelete = async () => {
    await deleteProduct(product.id)
    router.push('/home/products')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[20rem]">
        <DropdownMenuLabel>Product Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isOwner ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push(`/home/products/my-orders`)}>
              <ArchiveIcon className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/home/products/${product.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Product</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span className="text-destructive">Delete Product</span>
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
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuItem onClick={() => router.push(`/home/products/sellers/${product.sellerId}`)}>
            <User className="mr-2 h-4 w-4" />
            <span>View Seller</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}