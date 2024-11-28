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
  PanelRight
} from "lucide-react"

export const SideMenu = () => {
  const router = useRouter()
  const [openCategories, setOpenCategories] = React.useState(true)
  const [openSeller, setOpenSeller] = React.useState(true)
  const [openCustomer, setOpenCustomer] = React.useState(true)

  const eventTypes = [
    { name: 'All Events', path: '/home/events' },
    { name: 'Academic', path: '/home/events?type=academic' },
    { name: 'Social', path: '/home/events?type=social' },
    { name: 'Cultural', path: '/home/events?type=cultural' },
    { name: 'Sports', path: '/home/events?type=sports' },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Campus Events</SheetTitle>
          <SheetDescription>
            Discover and organise events within your campus community.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[80vh]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setOpenCategories(!openCategories)}
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Categories
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openCategories ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openCategories && (
                <div className="ml-4 mt-2 space-y-1">
                  {eventTypes.map((event) => (
                    <Button
                      key={event.name}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push(event.path)}
                    >
                      {event.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setOpenSeller(!openSeller)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Admins
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openSeller ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openSeller && (
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/home/events/add')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create event
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/events?mine=true")}>
                    <Package className="mr-2 h-4 w-4" />
                    My events
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
                  Users
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openCustomer ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openCustomer && (
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/events?attending=true")}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Events I am attending
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