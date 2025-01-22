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

export const SideMenu = () => {
  const router = useRouter()
  const [openDriver, setOpenDriver] = React.useState(true)
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
          <SheetTitle className="text-2xl font-bold">Campus Rides</SheetTitle>
          <SheetDescription>
            Get Driven by a Verified User just like you. Only on Unihive!
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[80vh]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setOpenDriver(!openDriver)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Driver
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openDriver ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openDriver && (
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register as Driver
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />
                    My History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
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
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/products/my-orders")}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Saved Locations
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/products/cart")}>
                    <History className="mr-2 h-4 w-4" />
                    History
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