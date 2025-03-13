"use client"

import React from 'react'
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  ShoppingBag,
  UserCircle,
  PlusCircle,
  Package,
  BarChart3,
  ClipboardList,
  ChevronDown,
  PanelRight,
  History,
  MapPin
} from "lucide-react"
import { DashboardIcon } from '@radix-ui/react-icons'

export const SideMenu = () => {
const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-2 py-2">
          <h2 className="text-2xl font-bold mb-1">Campus Rides</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Get Driven by a Verified User just like you. Only on DormBiz!
          </p>
        </div>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Driver</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={()=>router.push("/home/rides/driver")} >
                <DashboardIcon className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>router.push("/home/rides/driver/register")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Register as Driver</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Customer</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => router.push("/home/products/my-orders")}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>Saved Locations</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/products/cart")}>
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}