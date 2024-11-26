"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from 'lucide-react'
import { CartItem, Product, Cart } from '@prisma/client'
import { updateCartItemQuantity, removeCartItem } from '@/actions/cart'

type CartItemWithProduct = CartItem & {
  product: Product
}

export function CartContent({cart}: {cart: Cart & {cartItems: CartItemWithProduct[]}}) {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>(cart.cartItems)

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    await updateCartItemQuantity(id, newQuantity)
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(id)
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center p-4">
            <div className="flex-shrink-0 mr-4">
              <Image src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="rounded-md" />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                max={item.product.stock}
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                className="w-16"
                disabled={item.wasRequested}
              />
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
  )
}