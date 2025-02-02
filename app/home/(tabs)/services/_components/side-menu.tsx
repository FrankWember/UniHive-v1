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
import { ShoppingBag, UserCircle, PlusCircle, Package, BarChart3, ClipboardList, PanelRight, MessageCircle, CreditCard } from 'lucide-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideMenu({ className }: SidebarProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[20rem]">
        <DropdownMenuLabel>Campus Marketplace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Seller</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/home/services/add')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add Service</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/services?mine=true")}>
            <Package className="mr-2 h-4 w-4" />
            <span>My services</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/home/inbox`)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Inbox</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/home/services/billing`)}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/services/analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Customer</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/home/services/my-bookings")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/home/inbox`)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Inbox</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}