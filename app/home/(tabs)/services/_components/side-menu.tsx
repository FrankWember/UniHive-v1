"use client"

import React from 'react'
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  UserCircle,
  PlusCircle,
  Package,
  BarChart3,
  ClipboardList,
  ChevronDown,
  PanelRight
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideMenu({ className }: SidebarProps) {
  const router = useRouter()
  const [openSeller, setOpenSeller] = React.useState(true)
  const [openCustomer, setOpenCustomer] = React.useState(true)


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Campus Marketplace</SheetTitle>
          <SheetDescription>
            Discover and sell services within your campus community.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[80vh]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setOpenSeller(!openSeller)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Seller
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openSeller ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openSeller && (
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/home/services/add')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/services?mine=true")}>
                    <Package className="mr-2 h-4 w-4" />
                    My services
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/services/bookings")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Bookings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/services/analytics")}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              )}
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setOpenCustomer(!openCustomer)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Customer
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openCustomer ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openCustomer && (
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/services/my-bookings")}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}