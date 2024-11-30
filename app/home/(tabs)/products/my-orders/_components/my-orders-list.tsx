'use client'

import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Cart, CartItem, Product } from '@prisma/client'

type Order = Cart & {
  cartItems: (CartItem & {
    product: Product
  })[]
}

export function MyOrdersList() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Fetch customer's orders from API
    const fetchOrders = async () => {
      const response = await fetch('/api/customer/orders')
      const data = await response.json()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  return (
    <Accordion type="single" collapsible className="w-full">
      {orders.map((order) => (
        <AccordionItem key={order.id} value={order.id}>
          <AccordionTrigger>
            Order - {new Date(order.createdAt).toLocaleDateString()} - ${order.totalPrice.toFixed(2)}
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <strong>Status:</strong> {order.isPaid ? 'Paid' : 'Unpaid'}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}