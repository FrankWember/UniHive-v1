"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from '@/actions/cart'
import { CartItem, Product, Cart } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { BeatLoader } from 'react-spinners'

export function CartSummary({cart}: {cart: Cart & {cartItems: (CartItem & {product: Product})[]}}) {
  const [subtotal, setSubtotal] = useState(cart.totalPrice)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(cart.totalPrice)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    try{
      setIsLoading(true)
      await createCheckoutSession(cart.id)
      toast ({
        title: "Checkout Started!",
        description: "You will be redirected to the payments page.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckout} disabled={isLoading}>
          {isLoading ? <BeatLoader /> : "Proceed to Checkout"}
        </Button>
      </CardFooter>
    </Card>
  )
}