'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

type Order = {
  id: string
  customerName: string
  totalAmount: number
  orderDate: string
  status: string
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      const response = await fetch('/api/seller/orders')
      const data = await response.json()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  const handleViewOrder = (orderId: string) => {
    router.push(`/home/products/orders/${orderId}`)
  }

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
              <Button onClick={() => handleViewOrder(order.id)}>View Details</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}