"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { CartItem, Product, Cart } from '@prisma/client'
import { updateCartItemQuantity, removeCartItem } from '@/actions/cart'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from 'next/navigation'

type CartItemWithProduct = CartItem & {
  product: Product
}

export function CartContent({cart}: {cart: Cart & {cartItems: CartItemWithProduct[]}}) {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>(cart.cartItems)
  const [open, setOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    await updateCartItemQuantity(id, newQuantity)
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
    setOpen(false)
    router.refresh()
  }

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(id)
    setCartItems(cartItems.filter(item => item.id !== id))
    router.refresh()
  }

  const openDialog = (itemId: string) => {
    setSelectedItemId(itemId)
    setOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center p-4">
              <div className="flex-shrink-0 mr-4">
                <Image src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="rounded-md" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">${(item.product.price - (item.product.price * (item.product.discount || 0) / 100)).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="w-16"
                  onClick={() => openDialog(item.id)}
                  disabled={item.wasRequested}
                >
                  {item.quantity}
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {cartItems.length === 0 && (
          <p className="text-center text-muted-foreground">Your cart is empty.</p>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Select quantity..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {selectedItemId && cartItems.find(item => item.id === selectedItemId)?.product.stock && 
              Array.from({ length: cartItems.find(item => item.id === selectedItemId)!.product.stock }, (_, i) => i + 1).map((num) => (
                <CommandItem
                  key={num}
                  onSelect={() => handleUpdateQuantity(selectedItemId, num)}
                >
                  {num}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}