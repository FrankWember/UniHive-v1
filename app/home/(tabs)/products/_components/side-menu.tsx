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
import { LayoutGrid, User, Package, PlusCircle, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const SideMenu = () => {
  const router = useRouter()

  const categories = [
    { name: 'All', path: '/home/products' },
    { name: 'Electronics', path: '/home/products?category=electronics' },
    { name: 'Books', path: '/home/products?category=books' },
    { name: 'Clothing', path: '/home/products?category=clothing' },
    { name: 'Home & Garden', path: '/home/products?category=home-garden' },
    { name: 'Sports', path: '/home/products?category=sports' },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Campus Marketplace</SheetTitle>
          <SheetDescription>
            Discover and sell products within your campus community.
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
            <h3 className="text-lg font-medium">Manage Products</h3>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push('/home/products/new')} className="justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              <Button onClick={() => router.push("/home/products?mine=true")} className="justify-start">
                <Package className="mr-2 h-4 w-4" />
                My Products
              </Button>
              <Button onClick={() => router.push("/home/products/orders")} className="justify-start">
                <ShoppingBag className="mr-2 h-4 w-4" />
                My Orders
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}