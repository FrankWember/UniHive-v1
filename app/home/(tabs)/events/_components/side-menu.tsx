"use client"

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Component2Icon, PersonIcon, PlusIcon, CalendarIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'

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
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Component2Icon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Campus Events</SheetTitle>
          <SheetDescription>
            Discover and create events to enhance your campus experience.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="eventTypes">
              <AccordionTrigger>Event Types</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2">
                  {eventTypes.map((type) => (
                    <Button
                      key={type.name}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => router.push(type.path)}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Manage Events</h3>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push('/home/events/create')} className="justify-start">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
              </Button>
              <Button onClick={() => router.push("/home/events?mine=true")} className="justify-start">
                <PersonIcon className="mr-2 h-4 w-4" />
                My Events
              </Button>
              <Button onClick={() => router.push("/home/events?attending=true")} className="justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Events I'm Attending
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}