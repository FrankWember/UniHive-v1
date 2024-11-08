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
import { Component2Icon, LayersIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const SideMenu = () => {
  const router = useRouter()

  const categories = [
    { name: 'All', path: '/home/services' },
    { name: 'Food', path: '/home/services?category=food' },
    { name: 'Transportation', path: '/home/services?category=transportation' },
    { name: 'Entertainment', path: '/home/services?category=entertainment' },
    { name: 'Academic', path: '/home/services?category=academic' },
    { name: 'Health & Wellness', path: '/home/services?category=health' },
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
          <SheetTitle className="text-2xl font-bold">Campus Services</SheetTitle>
          <SheetDescription>
            Discover and offer services to enhance your campus experience.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => router.push(category.path)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Manage Services</h3>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push('/home/services/add')} className="justify-start">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Service
              </Button>
              <Button onClick={() => router.push("/home/services?mine=true")} className="justify-start">
                <PersonIcon className="mr-2 h-4 w-4" />
                My Services
              </Button>
              <Button onClick={() => router.push("/home/services/my-bookings")} className="justify-start">
                <LayersIcon className="mr-2 h-4 w-4" />
                My Bookings
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}