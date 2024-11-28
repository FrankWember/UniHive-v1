'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number
}

type Order = {
  id: string
  customerName: string
  totalAmount: number
  orderDate: string
  status: string
  items: OrderItem[]
}

export function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const {toast} = useToast()

  useEffect(() => {
    // Fetch order details from API
    const fetchOrderDetails = async () => {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      setOrder(data)
    }
    fetchOrderDetails()
  }, [orderId])

  const handleMarkAsDelivered = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/deliver`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to mark order as delivered')
      }

      setOrder((prevOrder) => prevOrder ? { ...prevOrder, status: 'Delivered' } : null)
      toast({
        title: 'Order Updated',
        description: 'The order has been marked as delivered.',
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the order status.',
        variant: 'destructive',
      })
    }
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Information</h2>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
      </div>

      <Table>
        <TableCaption>Order Items</TableCaption>
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

      {order.status !== 'Delivered' && (
        <Button onClick={handleMarkAsDelivered} className="mt-6">
          Mark as Delivered
        </Button>
      )}
    </div>
  )
}