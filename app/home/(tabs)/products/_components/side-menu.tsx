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

  const categories = [
    { name: 'All', path: '/home/products' },
    { name: 'Electronics', path: '/home/products?category=electronics' },
    { name: 'Books', path: '/home/products?category=books' },
    { name: 'Clothing', path: '/home/products?category=clothing' },
    { name: 'jewelry', path: '/home/products?category=home-garden' },
    { name: 'Sports', path: '/home/products?category=sports' },
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
          <SheetTitle className="text-2xl font-bold">Campus Marketplace</SheetTitle>
          <SheetDescription>
            Discover and sell products within your campus community.
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
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push(category.path)}
                    >
                      {category.name}
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
                  Seller
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", openSeller ? "rotate-180" : "")} />
                </Button>
              </h2>
              {openSeller && (
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/home/products/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/products?mine=true")}>
                    <Package className="mr-2 h-4 w-4" />
                    My Products
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/products/orders")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/products/analytics")}>
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
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/home/products/cart")}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Cart
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