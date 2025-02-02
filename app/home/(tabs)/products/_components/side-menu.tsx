"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
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
import { LayoutGrid, ShoppingBag, UserCircle, PlusCircle, Package, BarChart3, ClipboardList, PanelRight } from 'lucide-react'

export const SideMenu = () => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[25rem]">
        <DropdownMenuLabel>Campus Marketplace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Seller</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/home/products/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add Product</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/products?mine=true")}>
            <Package className="mr-2 h-4 w-4" />
            <span>My Products</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/products/orders")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/products/analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Customer</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/home/products/my-orders")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/products/cart")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>My Cart</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}