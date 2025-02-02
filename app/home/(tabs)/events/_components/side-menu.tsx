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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, ShoppingBag, UserCircle, PlusCircle, Package, ClipboardList, PanelRight } from 'lucide-react'

export const SideMenu = () => {
  const router = useRouter()

  const eventTypes = [
    { name: 'All Events', path: '/home/events' },
    { name: 'Academic', path: '/home/events?type=academic' },
    { name: 'Social', path: '/home/events?type=social' },
    { name: 'Cultural', path: '/home/events?type=cultural' },
    { name: 'Sports', path: '/home/events?type=sports' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <PanelRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[20rem]">
        <DropdownMenuLabel>Campus Events</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Categories</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {eventTypes.map((event) => (
              <DropdownMenuItem key={event.name} onClick={() => router.push(event.path)}>
                {event.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <UserCircle className="mr-2 h-4 w-4 inline-block" />
            Admins
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/home/events/create')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create event</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/home/events?mine=true")}>
            <Package className="mr-2 h-4 w-4" />
            <span>My events</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <ShoppingBag className="mr-2 h-4 w-4 inline-block" />
            Users
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/home/events?attending=true")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>Events I am attending</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}