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

type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number
}

type Order = {
  id: string
  orderDate: string
  status: string
  totalAmount: number
  items: OrderItem[]
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
            Order #{order.id} - {new Date(order.orderDate).toLocaleDateString()} - ${order.totalAmount.toFixed(2)}
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
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <strong>Status:</strong> {order.status}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}