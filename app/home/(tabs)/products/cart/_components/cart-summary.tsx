"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from '@/actions/cart'
import { CartItem, Product, Cart } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { BeatLoader } from 'react-spinners'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LocationInput } from '@/components/location-input'
import { checkoutSchema } from '@/constants/zod'

export function CartSummary({cart}: {cart: Cart & {cartItems: (CartItem & {product: Product})[]}}) {
  const [subtotal, setSubtotal] = useState(cart.totalPrice)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(cart.totalPrice)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: '',
    },
  })

  useEffect(() => {
    const newSubtotal = cart.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    setSubtotal(newSubtotal)
    setTotal(newSubtotal + tax)
  }, [cart.cartItems, tax])

  const handleCheckout = async (values: z.infer<typeof checkoutSchema>) => {
    try {
      setIsLoading(true)
      await createCheckoutSession(cart.id, values.deliveryAddress)
      toast({
        title: "Checkout Started!",
        description: "You will be redirected to the payments page.",
      })
      router.push("/home/products/my-orders")
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCheckout)}>
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
            <div className="mt-6">
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <LocationInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/home/products">Continue Shopping</Link>
            </Button>
            <Button type="submit" disabled={isLoading || cart.cartItems.length === 0}>
              {isLoading ? <BeatLoader /> : 'Checkout'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}